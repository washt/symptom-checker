from rest_framework.views import APIView
from rest_framework.response import Response

from rare_conditions.models import Disease, Symptom, SymptomFreqs
import json

# Create your views here.
class SymptomCheckerView(APIView):
  def get(self, request, form=None):

    symptoms = Symptom.objects.all()

    sym_map = {}

    for sym in symptoms.values_list('name','hpo_id'):
      sym_map[sym[0]] = sym[1] 


    return Response(json.dumps(sym_map))

  def post(self, request, form=None):
    payload = json.loads(request.body)

    # @TODO validate payload before passing to query
    # regex HP:0100578 -> HP:\d{7}$

    # matching algo ideas
    #  MST of frequent symptoms over disorders?
    # https://en.wikipedia.org/wiki/Minimum_spanning_tree

    # Convex Hull + Success Polygons?
    # https://punkrockor.com/2009/05/29/convex-hull-for-recipes/
    
    # Range Search or nearest-neighbors with KD-Tree?
    # https://en.wikipedia.org/wiki/K-d_tree
    symptoms_qs = SymptomFreqs.objects.filter(hpo_id__in=payload).values_list('disorder_id')[:5]

    symptoms = [ x[0] for x in symptoms_qs ]

    diseases = Disease.objects.filter(disorder_id__in=symptoms).values_list('name', 'expert_link')

    return Response(diseases.values_list('name', 'expert_link'))