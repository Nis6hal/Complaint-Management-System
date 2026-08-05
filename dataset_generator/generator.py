"""
Generator script under dataset_generator/
"""

import os
import random
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker

from dataset_generator.locations import PROVINCE_DISTRICT_MAP
from dataset_generator.engineers import ENGINEERS
from dataset_generator.resolutions import RESOLUTIONS_TEMPLATES
from dataset_generator.nepali_variations import add_variations
from dataset_generator.complaint_templates import (
    CUSTOMER_TYPES, CUSTOMER_PLANS, COMPLAINT_CHANNELS,
    ROUTER_BRANDS, DEVICE_TYPES, CATEGORY_RULES, COMPLAINT_PATTERNS
)

fake = Faker()

def generate_complaint_record(record_id, start_date):
    category = random.choice(list(CATEGORY_RULES.keys()))
    cat_rule = CATEGORY_RULES[category]

    province = random.choice(list(PROVINCE_DISTRICT_MAP.keys()))
    district = random.choice(PROVINCE_DISTRICT_MAP[province])

    customer_type = random.choice(CUSTOMER_TYPES)
    customer_plan = random.choice(CUSTOMER_PLANS[customer_type])
    channel = random.choice(COMPLAINT_CHANNELS)
    network_tech = random.choice(cat_rule["tech"])

    language = random.choice(["English", "Nepali-English", "Nepali-English"])
    lang_key = "English" if language == "English" else "Nepglish"

    base_text = random.choice(COMPLAINT_PATTERNS[category][lang_key])
    complaint_text = add_variations(base_text)

    severity = cat_rule["severity"]
    if customer_type in ["Corporate", "Government"] and severity in ["Medium", "High"]:
        priority = "Critical"
    else:
        priority = cat_rule["priority"]

    status = random.choices(["Resolved", "In Progress", "Pending", "Closed", "Escalated"], weights=[0.55, 0.20, 0.10, 0.10, 0.05])[0]
    department = cat_rule["department"]
    assigned_engineer = random.choice(ENGINEERS) if status != "Pending" else "Eng. Unassigned"

    escalated = True if (priority == "Critical" and random.random() < 0.6) or status == "Escalated" else False
    duplicate_ticket = True if random.random() < 0.08 else False

    if priority in ["Critical", "High"] or escalated:
        sentiment = random.choice(["Angry", "Frustrated"])
    elif priority == "Medium":
        sentiment = random.choice(["Frustrated", "Neutral"])
    else:
        sentiment = random.choice(["Neutral", "Happy"])

    resolution_hours = 0.0
    if status in ["Resolved", "Closed"]:
        if priority == "Critical":
            resolution_hours = round(random.uniform(0.5, 6.0), 2)
        elif priority == "High":
            resolution_hours = round(random.uniform(2.0, 18.0), 2)
        elif priority == "Medium":
            resolution_hours = round(random.uniform(6.0, 48.0), 2)
        else:
            resolution_hours = round(random.uniform(12.0, 72.0), 2)

        res_template = random.choice(RESOLUTIONS_TEMPLATES)
        resolution = res_template.format(district=district)
    else:
        resolution = "Pending investigation by assigned field team."

    customer_rating = None
    if status in ["Resolved", "Closed"]:
        if sentiment in ["Happy", "Neutral"]:
            customer_rating = random.choice([4, 5])
        elif resolution_hours < 8.0:
            customer_rating = random.choice([3, 4, 5])
        else:
            customer_rating = random.choice([1, 2, 3])

    router_brand = random.choice(ROUTER_BRANDS) if network_tech in ["FTTH", "ADSL", "Fiber"] else "N/A"
    device_type = random.choice(DEVICE_TYPES)
    
    if priority == "Critical":
        estimated_cost = round(random.uniform(1500, 8000), 2)
    elif priority == "High":
        estimated_cost = round(random.uniform(500, 2500), 2)
    else:
        estimated_cost = round(random.uniform(0, 500), 2)

    random_days = random.randint(0, 180)
    random_seconds = random.randint(0, 86400)
    ticket_datetime = start_date - timedelta(days=random_days, seconds=random_seconds)

    return {
        "ComplaintID": f"NTC-{ticket_datetime.strftime('%Y%m')}-{record_id:06d}",
        "Date": ticket_datetime.strftime("%Y-%m-%d"),
        "Time": ticket_datetime.strftime("%H:%M:%S"),
        "Province": province,
        "District": district,
        "CustomerType": customer_type,
        "CustomerPlan": customer_plan,
        "ComplaintChannel": channel,
        "ComplaintText": complaint_text,
        "Language": language,
        "Category": category,
        "SubCategory": random.choice(cat_rule["subcategories"]),
        "Priority": priority,
        "Severity": severity,
        "Department": department,
        "Status": status,
        "AssignedEngineer": assigned_engineer,
        "Resolution": resolution,
        "ResolutionHours": resolution_hours,
        "Escalated": escalated,
        "DuplicateTicket": duplicate_ticket,
        "Sentiment": sentiment,
        "CustomerRating": customer_rating if customer_rating else "",
        "NetworkTechnology": network_tech,
        "DeviceType": device_type,
        "RouterBrand": router_brand,
        "EstimatedCost": estimated_cost,
        "AISummary": cat_rule["ai_summary"]
    }

def generate_dataset(num_records=15000, output_dir="dataset", train_ratio=0.8, val_ratio=0.1, test_ratio=0.1):
    print(f"[*] Generating {num_records:,} synthetic records...")
    os.makedirs(output_dir, exist_ok=True)
    
    start_date = datetime.now()
    records = [generate_complaint_record(i, start_date) for i in range(1, num_records + 1)]
    df = pd.DataFrame(records)

    full_filepath = os.path.join(output_dir, "complaints.csv")
    df.to_csv(full_filepath, index=False, encoding="utf-8")
    
    # Standard output also as complaints_all.csv for backward compatibility
    df.to_csv(os.path.join(output_dir, "complaints_all.csv"), index=False, encoding="utf-8")

    df_shuffled = df.sample(frac=1, random_state=42).reset_index(drop=True)
    train_end = int(len(df_shuffled) * train_ratio)
    val_end = train_end + int(len(df_shuffled) * val_ratio)

    train_df = df_shuffled.iloc[:train_end]
    val_df = df_shuffled.iloc[train_end:val_end]
    test_df = df_shuffled.iloc[val_end:]

    train_df.to_csv(os.path.join(output_dir, "train.csv"), index=False, encoding="utf-8")
    val_df.to_csv(os.path.join(output_dir, "validation.csv"), index=False, encoding="utf-8")
    test_df.to_csv(os.path.join(output_dir, "test.csv"), index=False, encoding="utf-8")

    print(f"[SUCCESS] Dataset created in '{output_dir}'")
    return df

if __name__ == "__main__":
    generate_dataset(15000)
