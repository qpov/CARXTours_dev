from django.db import models
from django.contrib.auth.models import User

class Tournament(models.Model):
    short_org_name = models.CharField(max_length=255)
    full_org_name = models.CharField(max_length=255)
    tournament_name = models.CharField(max_length=255)
    date = models.DateField()
    map = models.CharField(max_length=255)
    map_link = models.URLField(blank=True, null=True)
    task = models.TextField()
    example = models.URLField()
    reglament = models.TextField()
    visual_reglament = models.TextField(blank=True, null=True)
    max_pilots = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tournaments/', null=True, blank=False)

class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participations')
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    try1 = models.CharField(max_length=255, null=True, blank=True)
    try2 = models.CharField(max_length=255, null=True, blank=True)