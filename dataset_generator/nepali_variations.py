"""
Nepali-English variations and typo modifiers module
"""

import random

TYPO_MODIFIERS = [
    lambda text: text.replace("internet", "internt"),
    lambda text: text.replace("router", "roter"),
    lambda text: text.replace("connect", "conect"),
    lambda text: text.replace("working", "workin"),
    lambda text: text.replace("please", "plz"),
    lambda text: text.replace("slow", "solw"),
    lambda text: text.replace("light", "lite"),
    lambda text: text.replace("recharge", "rechare"),
    lambda text: text.replace("problem", "prblm"),
    lambda text: text.replace("chha", "cha"),
    lambda text: text.replace("bhayena", "bhyena"),
    lambda text: text.replace("gardinus", "gdnus"),
]

def add_variations(text, apply_typos=True, add_prefix=True):
    prefixes = [
        "Urgent: ", "Heloo support team, ", "Respected Sir, ", "FYI, ",
        "Complain: ", "Problem report - ", "Dear NTC, ", "NTC Support, ", ""
    ]
    suffixes = [
        " Please fix ASAP.", " Thanks.", " Solved this fast.",
        " Kindly check.", " Urgent response needed!", " Waiting for reply.", ""
    ]

    if add_prefix and random.random() < 0.4:
        text = random.choice(prefixes) + text
    if add_prefix and random.random() < 0.4:
        text = text + random.choice(suffixes)

    if apply_typos and random.random() < 0.3:
        mod = random.choice(TYPO_MODIFIERS)
        text = mod(text)

    if random.random() < 0.15:
        text = text.upper()
    elif random.random() < 0.15:
        text = text.lower()

    return text
