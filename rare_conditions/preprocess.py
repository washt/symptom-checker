import xml.etree.ElementTree as ET
from pprint import pprint
from collections import defaultdict

# from models import Disease, Symptom

def etree_to_dict(t):
# borrowed from 
# https://stackoverflow.com/questions/2148119/how-to-convert-an-xml-string-to-a-dictionary
    d = {t.tag: {} if t.attrib else None}
    children = list(t)
    if children:
        dd = defaultdict(list)
        for dc in map(etree_to_dict, children):
            for k, v in dc.items():
                dd[k].append(v)
        d = {t.tag: {k:v[0] if len(v) == 1 else v for k, v in dd.items()}}
    if t.attrib:
        d[t.tag].update(('@' + k, v) for k, v in t.attrib.items())
    if t.text:
        text = t.text.strip()
        if children or t.attrib:
            if text:
              d[t.tag]['#text'] = text
        else:
            d[t.tag] = text
    return d

tree = ET.parse('rare_conditions/_data/symptom_map.xml')
root = tree.getroot()

hpo_dict = etree_to_dict(root)
disorder_status_list = hpo_dict["JDBOR"]['HPODisorderSetStatusList']['HPODisorderSetStatus']


# disorders = [{ "name": disorder['Disorder']['Name']['#text'],
#            "disorder_id": disorder['Disorder']['@id'],
#            "orpha_code": disorder['Disorder']['OrphaCode'],
#            "expert_link": disorder['Disorder']['ExpertLink']['#text'],
#            "online": disorder['Online'],
#            "source": disorder['Source'],
#            "symptoms": [ {
#                            'hpo_id': x['HPO']['HPOId'],
#                            'hpo_name': x['HPO']['HPOTerm'],
#                            'diagnostic_criteria': x['DiagnosticCriteria'],
#                            'hpo_freq': x['HPOFrequency']['Name']['#text']
#                          } for x in disorder['Disorder']['HPODisorderAssociationList']['HPODisorderAssociation'] ],
#            "validation_date": disorder['ValidationDate'],
#            "validation_status": disorder['ValidationStatus'],
#          } for disorder in disorder_status_list ]


breakpoint()


for disorder in disorder_status_list:
    pass


# pprint(disorders)
