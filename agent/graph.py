from dotenv import load_dotenv
from langchain_core.exceptions import OutputParserException
from langchain_core.globals import set_verbose, set_debug
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from langchain.agents import create_agent
from pprint import pprint
from langchain_core.output_parsers import PydanticOutputParser
import logging
import os
from tenacity import retry, stop_after_attempt, wait_exponential

from prompts import *
from states import *
from tools import *


load_dotenv()

set_debug(True)
set_verbose(True)

llm = ChatGroq(model='openai/gpt-oss-120b', api_key=os.getenv("GROQ_API_KEY"))

def planner_agent(state: dict) -> dict:
    user_prompt = state["user_prompt"]

    parser = PydanticOutputParser(pydantic_object=Plan)
    format_instructions = parser.get_format_instructions()

    full_prompt = planner_prompt(user_prompt) + "\n\n" + format_instructions

    try:
        response = llm.invoke(full_prompt)
        parsed = parser.parse(response.content)
    except OutputParserException as e:
        logging.error(f"Planner parsing failed: {e}")
        raise ValueError(f"Failed to parse planner output: {e}")

    return {"plan": parsed}


def architect_agent(state: dict) -> dict:
    plan: Plan = state["plan"]

    parser = PydanticOutputParser(pydantic_object=TaskPlan)
    format_instructions = parser.get_format_instructions()

    full_prompt = architect_prompt(plan) + "\n\n" + format_instructions

    try:
        response = llm.invoke(full_prompt)
        parsed = parser.parse(response.content)
    except OutputParserException as e:
        logging.error(f"Architect parsing failed: {e}")
        raise ValueError(f"Failed to parse architect output: {e}")

    # Attach the original plan for downstream use
    parsed.plan = plan
    return {"task_plan": parsed}

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def coder_agent(state: dict) -> dict:
    coder_state = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps

    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]

    existing_content = read_file.run(current_task.filepath)
    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )
    system_prompt = coder_system_prompt()

    coder_tools = [read_file, write_file, list_files, get_current_directory]

    # BIND TOOLS TO LLM FIRST
    llm_with_tools = llm.bind_tools(coder_tools)

    react_agent = create_agent(llm_with_tools, coder_tools)
    react_agent.invoke(
        {"messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]})

    coder_state.current_step_idx += 1

    return {"coder_state": coder_state}

# Build the graph
graph = StateGraph(dict)

graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

graph.add_edge("planner", "architect")
graph.add_edge("architect", "coder")
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END":END, "coder": "coder"}
)

graph.set_entry_point("planner")

# Compile with error handling (optional but recommended)
agent = graph.compile()

# Example usage
if __name__ == "__main__":
    user_prompt = "Build a simple colourful modern todo app in html css and js"

    try:
        result = agent.invoke({"user_prompt": user_prompt, "recursion_limit":100})
        pprint(result)
    except Exception as e:
        print(f"Agent execution failed: {e}")
        logging.exception(e)