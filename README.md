# Information Visualization - Team 11

# Get started
- [See the Demo](https://chas1ngwind.github.io/City-of-Amsterdam/){:target=_blank;}
- <a href="https://chas1ngwind.github.io/City-of-Amsterdam/" target="_blank">See the Demo</a>

# Score
### Population Stability Index
- A higher population index represents a better population stability
- Population_Stability_Score = {[Normalized[min:0,max:1]:(people working/population)]*100} + {[Normalized[min:0,max:1]:(people moving to/people moving away)]*100}

### Safety Score
- a higher safety index represents less secure
- Safety_Index = Safety Index

### Living Condition Score
- A higher living index represents a better living condition
- Living_Condition_Score = PopulationStabilityScore - 0.5 * SafetyScore + 100
- Maximum Living_Condition_Score is 120
- Missing data is set to 0
