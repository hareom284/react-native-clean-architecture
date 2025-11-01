#!/usr/bin/env python3
"""
Commit Message Linter
Created by: hareom284
Description: Checks commit message format (<scope>:<type> - <description>)
"""

import re
import sys

# Allowed commit types
ALLOWED_TYPES = {
    "feature",
    "fix",
    "refactor",
    "docs",
    "perf",
    "test",
    "build",
    "style",
    "chore",
    "release",
}

# ANSI colors for pretty output
RED = "\033[31m"
GREEN = "\033[32m"
RESET = "\033[0m"


def validate_commit_message(message: str):
    """
    Validate commit message format and return None if valid,
    or raise ValueError with explanation.
    """

    # Example: auth:fix - handle invalid tokens
    pattern = r"^([^:]+):([^\s]+) - (.+)$"
    match = re.match(pattern, message)

    if not match:
        raise ValueError(
            "Invalid format.\nExpected: <scope>:<type> - <description>\nExample: core:fix - handle bug"
        )

    scope, type_, description = match.groups()

    if type_ not in ALLOWED_TYPES:
        raise ValueError(f"Invalid type '{type_}'. Must be one of: {', '.join(ALLOWED_TYPES)}")

    if not description or not description[0].islower():
        raise ValueError("Description must start with a lowercase letter.")


def main():
    if len(sys.argv) < 2:
        print(f"{RED}✘ No commit message file provided{RESET}")
        sys.exit(1)

    commit_msg_file = sys.argv[1]

    # Read commit message
    with open(commit_msg_file, "r", encoding="utf-8") as f:
        message = f.read().strip()

    # Ignore merge commits
    if message.startswith("Merge branch"):
        sys.exit(0)

    try:
        validate_commit_message(message)
        print(f"{GREEN}✔ Commit message format valid!{RESET}")
    except ValueError as e:
        print(f"{RED}✘ Commit message rejected: {e}{RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()
