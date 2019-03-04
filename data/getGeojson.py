import pandas as pd
import numpy as np
import geopandas as gpd
import fiona
from sklearn import preprocessing
from shapely import wkt


initDf_safe = pd.read_csv(r"D:\000_VU_Study\P4\IV\project\d3_js_learn\liu\ams_safety_index_districts.csv")

initDf_stats = pd.read_csv(
    r"D:\000_VU_Study\P4\IV\project\d3_js_learn\liu\ams_stats_districts.csv")

#safety = safety_index
safeDf = initDf_safe[['district_1_in_area',
                 'safety_index_2014', 'safety_index_2015', 'safety_index_2016', 'safety_index_2017', 'polygon_of_district_1_in_area']]
safeDf.rename(columns={'district_1_in_area': 'district'}, inplace=True)

safeDf2 = initDf_safe[['district_2_in_area',
                      'safety_index_2014', 'safety_index_2015', 'safety_index_2016', 'safety_index_2017', 'polygon_of_district_2_in_area']]
safeDf2.rename(columns={'district_2_in_area': 'district'}, inplace=True)
safeDf2.rename(columns={'polygon_of_district_2_in_area': 'polygon_of_district_1_in_area'}, inplace=True)

safeDf3 = initDf_safe[['district_3_in_area',
                       'safety_index_2014', 'safety_index_2015', 'safety_index_2016', 'safety_index_2017', 'polygon_of_district_3_in_area']]
safeDf3.rename(columns={'district_3_in_area': 'district'}, inplace=True)
safeDf3.rename(columns={'polygon_of_district_3_in_area': 'polygon_of_district_1_in_area'}, inplace=True)

# delete disrict rows which have empty data
safeDf2.dropna(subset=["district"])
safeDf3.dropna(subset=["district"])

safeDf_merge = pd.concat([safeDf, safeDf2, safeDf3])

def computeScore(sub, total):
    score = sub/total
    # score_norm = (score - score.min()) / (dscore.max() - score.min())
    return score

years = ['2014','2015','2016','2017']
for year in years:
    initDf_stats['score_people_'+year] = initDf_stats.apply(lambda row: computeScore(row['people_working_'+year], row['population_'+year]), axis=1)
    initDf_stats['score_move_'+year] = initDf_stats.apply(lambda row: computeScore(
        row['people_moving_to_'+year], row['people_moving_away_'+year]), axis=1)
    # normalization population
    initDf_stats['score_people_norm_'+year] = (initDf_stats['score_people_'+year] - initDf_stats['score_people_'+year].min())/(
        initDf_stats['score_people_'+year].max() - initDf_stats['score_people_'+year].min())
    initDf_stats['score_people_norm_'+year] = initDf_stats['score_people_norm_'+year]*100
    # normallization move
    initDf_stats['score_move_norm_'+year] = (initDf_stats['score_move_'+year] - initDf_stats['score_move_'+year].min())/(
        initDf_stats['score_move_'+year].max() - initDf_stats['score_move_'+year].min())
    initDf_stats['score_move_norm_'+year] = initDf_stats['score_move_norm_'+year]*100

for year in years:
    initDf_stats['population_stability_score_'+year] = initDf_stats['score_move_norm_' +
                                                              year] + initDf_stats['score_people_norm_'+year]

#population_stability = {Normalized[min:0,max:1]:(people working/population)*100} + {Normalized[min:0,max:1]:(people moving to/people moving away)*100}
statsDf = initDf_stats[['district',
                        'population_stability_score_2014', 'population_stability_score_2015', 'population_stability_score_2016', 'population_stability_score_2017']]

#living condition score = (a*population stability)+(b*safety)
result = pd.merge(safeDf_merge, statsDf)
for year in years:
    result['living_condition_score_' + year] = 0.3*result['safety_index_'+year] + 0.7*result['population_stability_score_' + year]

# delete Zuidas and Elzenhagen, because they miss some values
# result.dropna(axis=0, how='any', inplace=True)
# get zero to missing data
result = result.fillna(0)

for year in years:
    result['population_stability_score_'+year] = result['population_stability_score_' + year].astype('int')
    result['safety_index_'+year] = result['safety_index_' + year].astype('int')
    result['living_condition_score_' + year]=result['living_condition_score_' + year].astype('int')
result.to_csv('score.csv')


result['polygon_of_district_1_in_area'] = result['polygon_of_district_1_in_area'].apply(
    wkt.loads)
safe_geo = gpd.GeoDataFrame(result, crs={'init': 'epsg:4326'})
safe_geo = safe_geo.set_geometry('polygon_of_district_1_in_area')
safe_geo.to_file('map.geojson', driver="GeoJSON")

# df.crs = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"
# safe_geo = gp.GeoDataFrame(safeDf)
