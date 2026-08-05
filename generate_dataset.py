"""
Nepal Telecom Synthetic Complaint Dataset Generator
====================================================
Senior Machine Learning Engineer & Telecom Domain Expert Implementation.

Generates realistic, highly realistic synthetic complaint datasets tailored for
AI-powered Complaint Management Systems (NLP classification, priority scoring, SLA predictions, customer sentiment analysis).
"""

import os
import random
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker

# Initialize Faker
fake = Faker()

# ----------------------------------------------------
# DOMAIN DATA DICTIONARIES & NEPAL GEOGRAPHY MAPPINGS
# ----------------------------------------------------

PROVINCE_DISTRICT_MAP = {
    "Koshi": ["Morang", "Sunsari", "Jhapa", "Ilam", "Udayapur", "Dhankuta"],
    "Madhesh": ["Parsa", "Bara", "Rautahat", "Sarlahi", "Dhanusha", "Siraha", "Saptari", "Mahottari"],
    "Bagmati": ["Kathmandu", "Lalitpur", "Bhaktapur", "Kavrepalanchok", "Chitwan", "Makwanpur", "NuwaKot", "Dhading"],
    "Gandaki": ["Kaski", "Tanahu", "Syangja", "Gorkha", "Nawalpur", "Lamjung"],
    "Lumbini": ["Rupandehi", "Banke", "Dang", "Palpa", "Arghakhanchi", "Kapilvastu"],
    "Karnali": ["Surkhet", "Dailekh", "Jumla", "Salyan", "Rukum West"],
    "Sudurpashchim": ["Kailali", "Kanchanpur", "Dadeldhura", "Doti", "Achham"]
}

CUSTOMER_TYPES = ["Residential", "Business", "Corporate", "Government"]

CUSTOMER_PLANS = {
    "Residential": ["Fiber 50Mbps", "Fiber 100Mbps", "Fiber 200Mbps", "4G Unlimited Pack", "ADSL Standard"],
    "Business": ["BizFiber 150Mbps", "BizFiber 300Mbps", "Corporate Dedicated 50Mbps", "Biz 4G Pro"],
    "Corporate": ["Dedicated Internet 100Mbps", "Dedicated Enterprise Fiber 1Gbps", "SLA Premium Fiber"],
    "Government": ["GovNet Dedicated 50Mbps", "GovNet Enterprise Fiber 100Mbps", "Secured Intranet SLA"]
}

COMPLAINT_CHANNELS = ["Mobile App", "Web Portal", "Call Center (198)", "Counter Visit", "Social Media", "SMS Alert"]

NETWORK_TECHNOLOGIES = ["FTTH", "Fiber", "4G", "5G", "ADSL", "Enterprise Ethernet"]

ROUTER_BRANDS = ["Nokia", "Huawei", "ZTE", "TP-Link", "D-Link", "Netgear", "Tenda", "Unknown/Generic"]
DEVICE_TYPES = ["ONT Optical Router", "Wi-Fi Router", "4G CPE Router", "Smartphone", "MiFi Dongle", "Fiber Media Converter"]

ENGINEERS = [
    "Eng. Ramesh Shrestha", "Eng. Sita Adhikari", "Eng. Bikash Thapa",
    "Eng. Prakash Maharjan", "Eng. Anish Karki", "Eng. Sunita Tamang",
    "Eng. Subash Giri", "Eng. Deepa Sharma", "Eng. Nabin Chaudhary", "Eng. Unassigned"
]

# Category definitions mapped to default severity, typical department, network tech, subcategories, and summary templates
CATEGORY_RULES = {
    "Fiber Cut": {
        "severity": "Critical",
        "priority": "Critical",
        "department": "Fiber Team",
        "tech": ["FTTH", "Fiber", "Enterprise Ethernet"],
        "subcategories": ["Main Trunk Cable Severed", "Drop Wire Snapped", "Road Expansion Damage", "PCC Pole Damage"],
        "ai_summary": "Physical fiber optic cable break identified; field repair dispatched."
    },
    "LOS Red": {
        "severity": "High",
        "priority": "High",
        "department": "Fiber Team",
        "tech": ["FTTH", "Fiber"],
        "subcategories": ["Blinking Red LOS Light", "Solid Red LOS Light", "Optical Power Low", "Patch Cord Damaged"],
        "ai_summary": "Loss of Signal (LOS) detected on ONT device."
    },
    "ONT Offline": {
        "severity": "High",
        "priority": "High",
        "department": "Fiber Team",
        "tech": ["FTTH"],
        "subcategories": ["ONT Power Off", "PON Light Out", "Fiber Attenuation Fault", "Adapter Blown"],
        "ai_summary": "ONT optical terminal offline or unregistered."
    },
    "Internet Down": {
        "severity": "High",
        "priority": "High",
        "department": "Internet Support",
        "tech": ["FTTH", "Fiber", "4G", "5G", "ADSL"],
        "subcategories": ["No Broadband Access", "WAN IP Disconnected", "Unregistered PPPoE", "Core Gateway Unreachable"],
        "ai_summary": "Total internet connectivity blackout reported by customer."
    },
    "Internet Slow": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Internet Support",
        "tech": ["FTTH", "Fiber", "4G", "5G", "ADSL"],
        "subcategories": ["Bandwidth Throttled", "Speed Test Below SLA", "Peak Hour Degradation", "High Overhead Latency"],
        "ai_summary": "Customer experiencing lower than subscribed bandwidth speed."
    },
    "High Ping": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Internet Support",
        "tech": ["FTTH", "Fiber", "4G", "5G"],
        "subcategories": ["Gaming Latency Spike", "International Gateway Jitter", "Packet Routing Delay"],
        "ai_summary": "High latency/ping spikes affecting real-time network traffic."
    },
    "Packet Loss": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Network Operations",
        "tech": ["FTTH", "Fiber", "4G", "Enterprise Ethernet"],
        "subcategories": ["Upstream Loss >15%", "Downstream Drops", "Interface Error Frames"],
        "ai_summary": "Significant packet drop detected on connection link."
    },
    "Router Issue": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Internet Support",
        "tech": ["FTTH", "ADSL", "4G"],
        "subcategories": ["Continuous Rebooting", "Overheating ONT", "Corrupted Firmware", "Ethernet Port Fault"],
        "ai_summary": "Hardware or firmware malfunction reported on customer premises router."
    },
    "Weak WiFi": {
        "severity": "Low",
        "priority": "Low",
        "department": "Internet Support",
        "tech": ["FTTH", "ADSL"],
        "subcategories": ["2.4GHz Coverage Weak", "SSID Not Broadcasted", "Frequency Interference", "Room Obstruction"],
        "ai_summary": "Wi-Fi signal propagation issues inside customer premises."
    },
    "SIM Activation": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Mobile Team",
        "tech": ["4G", "5G"],
        "subcategories": ["eSIM QR Code Failure", "KYC Verification Pending", "New SIM No Service", "MNP Porting Delay"],
        "ai_summary": "SIM card provisioning or KYC activation issue."
    },
    "SIM Blocked": {
        "severity": "High",
        "priority": "Medium",
        "department": "Mobile Team",
        "tech": ["4G", "5G"],
        "subcategories": ["PUK Code Locked", "IMEI Blacklisted", "Inactivity Suspension"],
        "ai_summary": "SIM line locked or blocked due to security/inactivity."
    },
    "Voice Call": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Mobile Team",
        "tech": ["4G", "5G"],
        "subcategories": ["VoLTE Call Drop", "One-Way Audio", "Call Muting", "Outbound Network Busy"],
        "ai_summary": "Voice call quality degradation or call establishment failure."
    },
    "SMS Failure": {
        "severity": "Low",
        "priority": "Low",
        "department": "Mobile Team",
        "tech": ["4G", "5G"],
        "subcategories": ["OTP SMS Delayed", "SMSC Center Error", "Outbound SMS Failed"],
        "ai_summary": "Customer unable to send or receive SMS / OTP notifications."
    },
    "Recharge Issue": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Billing",
        "tech": ["FTTH", "4G", "5G", "ADSL"],
        "subcategories": ["Payment Deducted But Not Credited", "Scratch Card Invalid", "eSewa / Khalti API Sync Fail", "Package Auto-Renew Fail"],
        "ai_summary": "Recharge/Top-up transaction success in payment portal but uncredited in billing Engine."
    },
    "Billing": {
        "severity": "Low",
        "priority": "Low",
        "department": "Billing",
        "tech": ["FTTH", "Fiber", "4G", "ADSL"],
        "subcategories": ["Incorrect Tariff Charged", "Rental Overcharge", "Duplicate Payment Deducted", "Tax Invoice Request"],
        "ai_summary": "Billing discrepancy or customer account tariff dispute."
    },
    "IPTV": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Internet Support",
        "tech": ["FTTH"],
        "subcategories": ["Set-Top Box Freezing", "Channel Black Screen", "Audio Out of Sync", "STB HDMI Signal Lost"],
        "ai_summary": "IPTV stream pixelation, freezing, or STB authentication failure."
    },
    "DNS": {
        "severity": "Medium",
        "priority": "Medium",
        "department": "Network Operations",
        "tech": ["FTTH", "Fiber", "4G", "5G"],
        "subcategories": ["Domain Name Unresolvable", "DNS Server Timeout", "CDN Routing Failure"],
        "ai_summary": "Primary/Secondary DNS server resolution failure for target domain names."
    },
    "Authentication": {
        "severity": "High",
        "priority": "High",
        "department": "Network Operations",
        "tech": ["FTTH", "ADSL"],
        "subcategories": ["PPPoE Auth Invalid Password", "RADIUS Server Timeout", "MAC Binding Mismatch"],
        "ai_summary": "PPPoE or RADIUS AAA authentication rejection."
    },
    "Enterprise": {
        "severity": "High",
        "priority": "High",
        "department": "Enterprise Support",
        "tech": ["Enterprise Ethernet", "Fiber"],
        "subcategories": ["Leased Line Down", "BGP Peering Down", "Static IP Routing Drop", "SLA Violation Alert"],
        "ai_summary": "Dedicated enterprise leased link outage reported with high SLA priority."
    },
    "Others": {
        "severity": "Low",
        "priority": "Low",
        "department": "Customer Care",
        "tech": ["FTTH", "4G"],
        "subcategories": ["Shift Connection Request", "Name Transfer Inquiry", "General Information Request"],
        "ai_summary": "General inquiry or non-technical support ticket."
    }
}

# ----------------------------------------------------
# NATURAL LANGUAGE COMPLAINT SYNTHESIS ENGINE
# ----------------------------------------------------

COMPLAINT_PATTERNS = {
    "Fiber Cut": {
        "English": [
            "Optic fiber cable snapped outside my building due to construction work. Total connection blackout.",
            "Fiber wire broken on the main street pole near my home. Fiber link down completely.",
            "Tree branch fell on the outdoor fiber line and broke it. Green fiber wire is hanging on the road.",
            "Local road expansion team cut the fiber cable wire under the pole. Fiber cut issue."
        ],
        "Nepglish": [
            "Ghar agadi ko fiber cable katyo road contractor le. Net sabai banda bhayo.",
            "Bahaar pillar ma bhako fiber wire tukra bhako xa. Fiber cut le garda internet aakai xaina.",
            "Rukh ko daangale main fiber cable chhyapryakkai chodyo. Cable physically damaged bhayo.",
            "Pole bata aako fiber cable chindiyo. Tarkari bari agadi fiber baangiyera bhangyo."
        ]
    },
    "LOS Red": {
        "English": [
            "My ONT router has a continuous blinking red light on LOS. Internet not working since morning.",
            "LOS red light is constantly turned on in my Nokia optical router. Restarted 3 times already.",
            "LOS indicator is blinking red rapidly. Optical power signal seems disconnected.",
            "Red LOS light showing in fiber device. Checked patch cord connection but problem remains."
        ],
        "Nepglish": [
            "Router ma LOS light red bhayera blink bhai rakheko xa. Internet chalekai chaina.",
            "Nokia ONT box ma LOS red light baleko chha. Cable sab thik dekhincha tara net aayena.",
            "Yesterday dekhi router ko LOS red bhai rako xa. Wire khukulo thiyo tara taade pani aayena.",
            "Fiber ONT box red light batulirakhya xa. Red light blink garera net gayo."
        ]
    },
    "ONT Offline": {
        "English": [
            "The ONT optical device power light won't turn on at all. Transformer adapter seems dead.",
            "ONT box is dead and power adapter smells hot. Device completely unresponsive.",
            "PON light is totally off in Huawei ONT fiber terminal. Connection down.",
            "Optical device is power cycling automatically every few minutes. Unstable power."
        ],
        "Nepglish": [
            "ONT box power off chha adapter fuse bhayo jasto xa. Device on nai bhayera aayenam.",
            "Fiber ko main box line missing xa, power indicator nayi light baaldaina.",
            "Light aada ghanta agadi gako thyo, light aaye pachi ONT router chalnai xodyo.",
            "Fiber adapter le light baalena. ONT device offline bhayo bilkul."
        ]
    },
    "Internet Down": {
        "English": [
            "Total internet blackout at our location for past 4 hours. PPPoE user showing disconnected.",
            "Internet has been down completely since 2 PM. Broadband status says offline.",
            "No internet access via WiFi or Ethernet cable. Main server not responding.",
            "Connection dropped unexpectedly. Cannot reach default gateway or any DNS."
        ],
        "Nepglish": [
            "Aaja bihanai dekhi internet chaleyrai chhaina. Please resolve fast.",
            "Net sabai block vayo. WiFi connected dekhauda ni internet not available dinchha.",
            "Beluka dekhi internet chalena. Office work completely stuck cha.",
            "Recharge gareko mobile app ma active dakhaucha tara internet zero chalya cha."
        ]
    },
    "Internet Slow": {
        "English": [
            "Subscribed to 100Mbps fiber plan but only receiving 4Mbps speed test result.",
            "Extremely slow internet speed during peak evening hours between 7 PM to 11 PM.",
            "Web pages taking forever to load and video streaming buffering continuously.",
            "Speed drop significantly since last two days. Download speed is under 1 Mbps."
        ],
        "Nepglish": [
            "Internet dammi slow cha, 200Mbps ko package ho tara speed 5Mbps ni aaudaina.",
            "Beluka bhaye pachi net testai slow hunchha, YouTube 240p ma pani buffer bhairacha.",
            "Net dherai nai slow bho. Page open huna minute lagchha.",
            "Recharge gare pachi झन् internet slow chali rakhya cha. Fix garidinus."
        ]
    },
    "High Ping": {
        "English": [
            "Experiencing unbearable ping latency over 350ms while playing online games like PUBG/CSGO.",
            "Ping spikes continuously from 25ms up to 600ms every 30 seconds.",
            "High packet latency jitter during Zoom video call meetings.",
            "Latency to Singapore and India servers is extremely high today."
        ],
        "Nepglish": [
            "Game khelda ping 400+ pugchha. High ping problem lagataar aairacha.",
            "Ping unstable cha, packet loss sangai high latency le गर्दा office meeting disconnect bhayo.",
            "Valorant ma lag bho dherai, ping zero unstable bhaerakhya chha.",
            "Bihan ko time ping thik hunchha, diuso dekhi high ping le problem diyo."
        ]
    },
    "Packet Loss": {
        "English": [
            "Continuous 20% packet loss noticed on network ping tests to 8.8.8.8.",
            "Intermittent request timeouts occurring every few seconds while browsing.",
            "Video stream keeps pixelating due to high dropped packets on upstream link."
        ],
        "Nepglish": [
            "Packet loss bho dherai, cmd ma ping garda request timed out aauchha continuous.",
            "Data drop bhaerako chha connection bata, live stream garna payena.",
            "Connection stable chaina, drop packets dherai dekhiyo router status ma."
        ]
    },
    "Router Issue": {
        "English": [
            "Router keeps rebooting continuously every 5 minutes automatically.",
            "Router ethernet ports are not assigning IP via DHCP to connected LAN PC.",
            "Router body is extremely hot and WiFi signals freeze every hour."
        ],
        "Nepglish": [
            "Router aafai restart bhai raakhchha 5-5 min ma. Hardware bigryo jasto cha.",
            "Router ko LAN port chalena, cable joda ni link light baldaina.",
            "Huawei router tataerakhya chha ra light haru sabai blink bhayera reset hunchha."
        ]
    },
    "Weak WiFi": {
        "English": [
            "Wi-Fi range is very weak outside the router room. Cannot connect from next room.",
            "5GHz WiFi SSID disappeared completely, only 2.4GHz is visible with weak signal.",
            "WiFi password keeps prompting incorrect even though entered correctly."
        ],
        "Nepglish": [
            "Kotha ma matrai WiFi aauchha, arko room ma signal dherai weak hunchha.",
            "WiFi signal range badhaunu paryo. Neighbor ko interfere bhayo lagchha.",
            "Phone ma WiFi disconnect bhai raakhchha room change garda."
        ]
    },
    "SIM Activation": {
        "English": [
            "New SIM card purchased yesterday still showing 'No Service' on mobile network.",
            "eSIM profile QR code scan failed with registration error. Service pending.",
            "Submitted KYC form 3 days ago at counter but SIM line not activated yet."
        ],
        "Nepglish": [
            "Naya SIM leko 24 hours bhanda besi bho tara tower aakai chaina (No Service).",
            "eSIM profile download bhayena. QR code invalid dekhaunchha.",
            "SIM card active gardidinus, citizenship verification update bho bhaneko thiyo."
        ]
    },
    "SIM Blocked": {
        "English": [
            "My SIM got locked with PUK code prompt after entering wrong PIN thrice.",
            "SIM card suddenly showing 'SIM Rejected' / 'MM#2 blocked' status.",
            "Mobile number suspended due to KYC non-update alert."
        ],
        "Nepglish": [
            "SIM ma PUK code maagyo mistakely PIN wrong hanera. Unlock code chahiyo.",
            "SIM block bhayo, incoming ra outgoing kei chaldaena.",
            "Number suspend vayecha kyc fill nagarera, instant unblock garidinu."
        ]
    },
    "Voice Call": {
        "English": [
            "Calls drop automatically within 10 seconds of answering on 4G VoLTE.",
            "One-way audio issue during voice calls; caller cannot hear my voice.",
            "Getting 'Network Busy' / 'All lines are occupied' error code when dialing."
        ],
        "Nepglish": [
            "Call garda aawaj katindai aauchha, complete noise aauchha voice ma.",
            "VoLTE call lagda aawaja nai aaudaina. Direct call cut hunchha.",
            "Phone garda Network Busy matra dekhauchha continuous."
        ]
    },
    "SMS Failure": {
        "English": [
            "Not receiving any bank OTP transaction SMS codes on my mobile number.",
            "SMS sending failed error code 38 on android messages app.",
            "Two-factor authentication codes delayed by over 30 minutes."
        ],
        "Nepglish": [
            "Mobile banking ko OTP code aaudai aayena text message ma.",
            "SMS pathauna khojda message send failed dinchha.",
            "SMS message center number wrong vayo hola SMS nai pass hudaina."
        ]
    },
    "Recharge Issue": {
        "English": [
            "Amount Rs. 1000 deducted via mobile banking app but internet quota not renewed.",
            "Recharge scratch card pin code unreadable / damaged while scratching.",
            "Recharge completed successfully in wallet app but balance still zero."
        ],
        "Nepglish": [
            "eSewa bata recharge gareko paisa katyo tara account ma balance credit bhayena.",
            "Recharge card ko 16 digit pin numeric card scratch garda dhyabai metiyo.",
            "Khalti bata pack buy gare, SMS aayo deduction ko tara data pack add bhayena."
        ]
    },
    "Billing": {
        "English": [
            "Billed for extra monthly rental charges despite plan subscription discount.",
            "Charged twice for single FTTH annual package renewal transaction.",
            "Requesting official VAT tax invoice copy for tax filing purposes."
        ],
        "Nepglish": [
            "Statement ma double charge katya chha, billing correction garidinus.",
            "Package expire nabhai kan nai service status suspend bhayechha billing ma.",
            "Bill invoice copy mail gardinus accounting department ko lagi."
        ]
    },
    "IPTV": {
        "English": [
            "IPTV setup box freezing on boot logo screen. Remote not responding.",
            "HD TV channels showing black screen with audio buffering error.",
            "Set-Top Box HDMI output showing 'No Signal' on television."
        ],
        "Nepglish": [
            "TV ma iptv channel sab sthapit (freeze) vayo, sound maatra aauchha video audaina.",
            "Setup Box ko red light nai blinks garerax chaina, TV ma NetTV dekhaena.",
            "Channels play garda authorization failed error aairacha setup box ma."
        ]
    },
    "DNS": {
        "English": [
            "Cannot resolve specific web domains, DNS probe finished bad config.",
            "Default NTC DNS servers 202.45.144.3 timing out continuously.",
            "Sites loading when using 8.8.8.8 but failing on automatic DNS."
        ],
        "Nepglish": [
            "Websites haru open hudaina DNS lookup failed bhanxa.",
            "DNS problem aayo, google ping hunchha tara domain resolution hudaina.",
            "Default DNS server le IP resolve garena."
        ]
    },
    "Authentication": {
        "English": [
            "PPPoE authentication error 691 invalid username or password on WAN link.",
            "RADIUS AAA server timeout during router PPPoE handshake attempt.",
            "MAC binding mismatch error preventing session start on ONT."
        ],
        "Nepglish": [
            "Router log ma PPPoE authentication failed bhanchha.",
            "Username password correct hunda pani log-in huna sakina optical connection ma.",
            "RADIUS server error le गर्दा session establish bhayena."
        ]
    },
    "Enterprise": {
        "English": [
            "Corporate 50Mbps Leased Line circuit #NTC-ENT-8843 down since 08:00 AM.",
            "BGP session peering dropped with primary ISP upstream gateway.",
            "Enterprise static IP subnet unroutable from external AS routes."
        ],
        "Nepglish": [
            "Office ko main leased line fiber link down bho. Critical business impacted.",
            "Corporate dedicated link down. Immediate field engineer dispatch required as per SLA.",
            "Enterprise Gateway static IP unreachable."
        ]
    },
    "Others": {
        "English": [
            "Request to shift fiber optic connection location to new apartment building nearby.",
            "Inquiry regarding ownership name transfer procedure for FTTH connection.",
            "Query regarding 5G coverage expansion schedule in our municipality ward."
        ],
        "Nepglish": [
            "Ghar sarnu pareko le internet connection shifting garidine application.",
            "Internet line arko manche ko naam ma transfer garna k k document chahinchha?",
            "Naya connection line lina bill payment counter kata chha?"
        ]
    }
}

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
    """
    Applies synthetic sentence variations, prefixes, suffixes, capitalization,
    and realistic user typos to maximize textual diversity.
    """
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

    # Random capitalization variation
    if random.random() < 0.15:
        text = text.upper()
    elif random.random() < 0.15:
        text = text.lower()

    return text


def generate_complaint_record(record_id, start_date):
    """Generates a single, highly realistic structured complaint record."""
    category = random.choice(list(CATEGORY_RULES.keys()))
    cat_rule = CATEGORY_RULES[category]

    # Geography mapping
    province = random.choice(list(PROVINCE_DISTRICT_MAP.keys()))
    district = random.choice(PROVINCE_DISTRICT_MAP[province])

    # Customer Demographics
    customer_type = random.choice(CUSTOMER_TYPES)
    customer_plan = random.choice(CUSTOMER_PLANS[customer_type])
    channel = random.choice(COMPLAINT_CHANNELS)
    network_tech = random.choice(cat_rule["tech"])

    # Language selection
    language = random.choice(["English", "Nepali-English", "Nepali-English"])
    lang_key = "English" if language == "English" else "Nepglish"

    # Dynamic text creation
    base_text = random.choice(COMPLAINT_PATTERNS[category][lang_key])
    complaint_text = add_variations(base_text)

    # Priority & Severity assignment rules
    severity = cat_rule["severity"]
    if customer_type in ["Corporate", "Government"] and severity in ["Medium", "High"]:
        priority = "Critical"
    else:
        priority = cat_rule["priority"]

    # Status & Assignment
    status = random.choices(["Resolved", "In Progress", "Pending", "Closed", "Escalated"], weights=[0.55, 0.20, 0.10, 0.10, 0.05])[0]
    department = cat_rule["department"]
    assigned_engineer = random.choice(ENGINEERS) if status != "Pending" else "Eng. Unassigned"

    # Escalated & Duplicate flags
    escalated = True if (priority == "Critical" and random.random() < 0.6) or status == "Escalated" else False
    duplicate_ticket = True if random.random() < 0.08 else False

    # Sentiment derivation
    if priority in ["Critical", "High"] or escalated:
        sentiment = random.choice(["Angry", "Frustrated"])
    elif priority == "Medium":
        sentiment = random.choice(["Frustrated", "Neutral"])
    else:
        sentiment = random.choice(["Neutral", "Happy"])

    # Resolution & SLA metrics
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

        resolutions = [
            f"Field team dispatched to site in {district}. Re-spliced optical fiber cable and tested optical power level (-19dBm). Link restored.",
            f"Rebooted port interface on OLT/BRAS gateway and refreshed PPPoE user session credentials.",
            f"Replaced faulty power supply adapter unit for ONT device. Verified line online status.",
            f"KYC documents manually verified in billing engine system and SIM profile activated.",
            f"Adjusted WiFi radio channel frequencies and updated router firmware to resolve stability issue.",
            f"Recharge transaction re-processed manually via payment clearing system; customer account credited."
        ]
        resolution = random.choice(resolutions)
    else:
        resolution = "Pending investigation by assigned field team."

    # Rating
    customer_rating = None
    if status in ["Resolved", "Closed"]:
        if sentiment in ["Happy", "Neutral"]:
            customer_rating = random.choice([4, 5])
        elif resolution_hours < 8.0:
            customer_rating = random.choice([3, 4, 5])
        else:
            customer_rating = random.choice([1, 2, 3])

    # Hardware & Financial fields
    router_brand = random.choice(ROUTER_BRANDS) if network_tech in ["FTTH", "ADSL", "Fiber"] else "N/A"
    device_type = random.choice(DEVICE_TYPES)
    
    if priority == "Critical":
        estimated_cost = round(random.uniform(1500, 8000), 2)
    elif priority == "High":
        estimated_cost = round(random.uniform(500, 2500), 2)
    else:
        estimated_cost = round(random.uniform(0, 500), 2)

    # Date / Time generation
    random_days = random.randint(0, 180)
    random_seconds = random.randint(0, 86400)
    ticket_datetime = start_date - timedelta(days=random_days, seconds=random_seconds)
    date_str = ticket_datetime.strftime("%Y-%m-%d")
    time_str = ticket_datetime.strftime("%H:%M:%S")

    return {
        "ComplaintID": f"NTC-{ticket_datetime.strftime('%Y%m')}-{record_id:06d}",
        "Date": date_str,
        "Time": time_str,
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
    """
    Generates a full synthetic dataset and exports `complaints_all.csv`,
    along with `train.csv`, `validation.csv`, and `test.csv` splits.

    Parameters:
    ------------
    num_records : int
        Number of complaint records to generate (e.g. 1000, 5000, 15000, 50000)
    output_dir : str
        Directory where CSV files will be saved.
    train_ratio : float
        Proportion of training set (e.g. 0.8)
    val_ratio : float
        Proportion of validation set (e.g. 0.1)
    test_ratio : float
        Proportion of test set (e.g. 0.1)
    """
    print(f"[*] Starting synthetic dataset generation for {num_records:,} records...")
    os.makedirs(output_dir, exist_ok=True)
    
    start_date = datetime.now()
    records = []

    for i in range(1, num_records + 1):
        rec = generate_complaint_record(i, start_date)
        records.append(rec)
        if i % 5000 == 0 or i == num_records:
            print(f"    - Generated {i:,} / {num_records:,} records...")

    df = pd.DataFrame(records)

    # Save complete dataset
    full_filepath = os.path.join(output_dir, "complaints_all.csv")
    df.to_csv(full_filepath, index=False, encoding="utf-8")
    print(f"[SUCCESS] Full dataset exported to: {full_filepath} ({len(df):,} rows)")

    # Perform Train / Validation / Test Split (80 / 10 / 10)
    df_shuffled = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    train_end = int(len(df_shuffled) * train_ratio)
    val_end = train_end + int(len(df_shuffled) * val_ratio)

    train_df = df_shuffled.iloc[:train_end]
    val_df = df_shuffled.iloc[train_end:val_end]
    test_df = df_shuffled.iloc[val_end:]

    train_path = os.path.join(output_dir, "train.csv")
    val_path = os.path.join(output_dir, "validation.csv")
    test_path = os.path.join(output_dir, "test.csv")

    train_df.to_csv(train_path, index=False, encoding="utf-8")
    val_df.to_csv(val_path, index=False, encoding="utf-8")
    test_df.to_csv(test_path, index=False, encoding="utf-8")

    print(f"[SUCCESS] Train set saved to:      {train_path} ({len(train_df):,} rows)")
    print(f"[SUCCESS] Validation set saved to: {val_path} ({len(val_df):,} rows)")
    print(f"[SUCCESS] Test set saved to:       {test_path} ({len(test_df):,} rows)")
    print("[COMPLETE] Dataset generation finished successfully!")

    return df


if __name__ == "__main__":
    # Change dataset size here to any value (e.g. 1000, 5000, 15000, 50000)
    TOTAL_RECORDS = 15000
    generate_dataset(num_records=TOTAL_RECORDS, output_dir="dataset")
