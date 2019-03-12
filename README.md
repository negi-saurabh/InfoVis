# Information Visualization - Team 11

# Get start
- python -m http.server 8888
- open your browser: http://localhost:8888/

# Score
### Population Stability Score
- higher score means better population stability
- PopulationStabilityScore = {[Normalized[min:0,max:1]:(people working/population)]*100} + {[Normalized[min:0,max:1]:(people moving to/people moving away)]*100}

### Safety Score
- higher score means less secure
- Safety Score = Safety Index

### Living Condition Score:
- higher score means better living condition
- LivingConditionScore = PopulationStabilityScore - 0.5 * SafetyScore +100
- Maxium LivingConditionScore is 120
- Missing data is set to 0