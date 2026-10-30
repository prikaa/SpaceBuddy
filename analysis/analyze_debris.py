"""
Space junk analysis for SpaceBuddy (data science track).

Input:  satcat.csv  (CelesTrak satellite catalog, CSV format)
Output: debris_summary.json  (small file the website reads)
        printed findings you can use in your pitch

Run:    python analyze_debris.py
Needs:  pip install pandas
"""

import json
import pandas as pd

# ---------------------------------------------------------------
# 1. LOAD
# ---------------------------------------------------------------
df = pd.read_csv("satcat.csv", dtype=str)  # read everything as text first; convert on purpose below
print(f"Loaded {len(df):,} catalog entries")

# ---------------------------------------------------------------
# 2. CLEAN
# ---------------------------------------------------------------
# Keep only objects orbiting Earth (ORBIT_CENTER "EA").
df = df[df["ORBIT_CENTER"] == "EA"].copy()

# Turn date text into real dates. Bad/missing values become NaT (not a time).
df["LAUNCH_DATE"] = pd.to_datetime(df["LAUNCH_DATE"], errors="coerce")
df["DECAY_DATE"] = pd.to_datetime(df["DECAY_DATE"], errors="coerce")
df = df.dropna(subset=["LAUNCH_DATE"])

# Still in orbit = it has no decay (re-entry) date.
df["IN_ORBIT"] = df["DECAY_DATE"].isna()

# Readable labels for object types.
# "Satellites" includes working AND dead ones.
TYPE_LABELS = {"PAY": "Satellites", "R/B": "Rocket bodies", "DEB": "Debris", "UNK": "Unknown"}
df["TYPE"] = df["OBJECT_TYPE"].map(TYPE_LABELS).fillna("Unknown")

# OBJECT_ID looks like "1999-025ABC". The first 8 characters ("1999-025")
# identify the LAUNCH. Every fragment from the same parent shares this prefix.
df["LAUNCH_ID"] = df["OBJECT_ID"].str[:8]

in_orbit = df[df["IN_ORBIT"]]

# ---------------------------------------------------------------
# 3. ANALYZE
# ---------------------------------------------------------------

# Q1: What is actually up there right now?
now_by_type = in_orbit["TYPE"].value_counts()

# Working satellites: payloads whose status is operational, partly operational,
# backup, spare, or extended mission (+, P, B, S, X in OPS_STATUS_CODE).
WORKING_CODES = {"+", "P", "B", "S", "X"}
working = in_orbit[(in_orbit["TYPE"] == "Satellites") & in_orbit["OPS_STATUS_CODE"].isin(WORKING_CODES)]
working_share = len(working) / len(in_orbit)

# Q2: How many objects have been put into orbit each year, by type?
#     (Note: debris is dated by its PARENT's launch, so this shows launch activity,
#      not when breakups happened. See Q3 for breakups.)
per_year = (
    df.groupby([df["LAUNCH_DATE"].dt.year, "TYPE"])
      .size()
      .unstack(fill_value=0)
      .sort_index()
)

# Q3: Which single launches created the most debris still in orbit?
debris_now = in_orbit[in_orbit["TYPE"] == "Debris"]
top_sources = debris_now["LAUNCH_ID"].value_counts().head(8)

# Name each source by what its fragments are called (e.g. "CZ-6A DEB" -> "CZ-6A").
# We do NOT use the first satellite from that launch: a launch can carry satellites
# AND a rocket stage, and the stage may be what broke apart. The debris name says
# which object the pieces came from.
def source_name(launch_id):
    names = debris_now.loc[debris_now["LAUNCH_ID"] == launch_id, "OBJECT_NAME"]
    return names.value_counts().index[0].replace(" DEB", "").strip()

# Q4: Who owns the debris still in orbit?
debris_by_owner = debris_now["OWNER"].value_counts().head(6)

# ---------------------------------------------------------------
# 4. REPORT (read these and turn them into your pitch!)
# ---------------------------------------------------------------
print("\n=== Objects in Earth orbit right now ===")
print(now_by_type.to_string())
print(f"-> Only {working_share:.0%} of tracked objects are WORKING satellites")
print("   (the rest are dead satellites, rocket bodies, debris, or unknown)")

print("\n=== Biggest single sources of debris still in orbit ===")
for launch_id, count in top_sources.items():
    print(f"{count:>6,}  {source_name(launch_id)}  ({launch_id})")

print("\n=== Debris in orbit by owner ===")
print(debris_by_owner.to_string())

# ---------------------------------------------------------------
# 5. EXPORT a small JSON for the website (never ship the full CSV to the browser)
# ---------------------------------------------------------------
summary = {
    "in_orbit_by_type": {k: int(v) for k, v in now_by_type.items()},
    "working_satellites": int(len(working)),
    "working_share": round(float(working_share), 3),
    "launched_per_year": {
        "years": [int(y) for y in per_year.index],
        "series": {col: [int(v) for v in per_year[col]] for col in per_year.columns},
    },
    "top_debris_sources": [
        {"name": source_name(lid), "launch_id": lid, "pieces": int(c)}
        for lid, c in top_sources.items()
    ],
    "debris_by_owner": {k: int(v) for k, v in debris_by_owner.items()},
}

with open("debris_summary.json", "w") as f:
    json.dump(summary, f, indent=2)
print("\nSaved debris_summary.json")