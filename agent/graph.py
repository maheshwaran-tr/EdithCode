from dotenv import load_dotenv
from langchain_core.exceptions import OutputParserException
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from pprint import pprint
from langchain_core.output_parsers import PydanticOutputParser
import logging

from prompts import *
from states import *

load_dotenv()

llm = ChatGroq(model='openai/gpt-oss-120b')

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


# Build the graph
graph = StateGraph(dict)

graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)

graph.add_edge("planner", "architect")
graph.add_edge("architect", END)  # Explicitly end after architect

graph.set_entry_point("planner")

# Compile with error handling (optional but recommended)
agent = graph.compile()

# Example usage
if __name__ == "__main__":
    user_prompt = "Create a very simple web based Todo Application"

    try:
        result = agent.invoke({"user_prompt": user_prompt})
        pprint(result)
    except Exception as e:
        print(f"Agent execution failed: {e}")
        logging.exception(e)