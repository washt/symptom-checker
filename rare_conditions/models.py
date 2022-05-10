from django.db import models

class Disease(models.Model):
  name = models.CharField(max_length=256)
  disorder_id = models.CharField(max_length=256)
  expert_link = models.CharField(max_length=256)
  orpha_code = models.CharField(max_length=256)

  class Meta:
    ordering = ['name']

    def __str__(self):
        return self.name
   
class Symptom(models.Model):
  hpo_id = models.CharField(max_length=256)
  name = models.CharField(max_length=256)
  diseases = models.ManyToManyField(Disease, blank=True)

  class Meta:
    ordering = ['name']

    def __str__(self):
        return self.name

class SymptomFreqs(models.Model):
  hpo_id = models.CharField(max_length=256)
  disorder_id = models.CharField(max_length=256)
  hpo_freq = models.IntegerField()

  class Meta:
    ordering = ['-hpo_freq']

    def __str__(self):
        return self.hpo_id