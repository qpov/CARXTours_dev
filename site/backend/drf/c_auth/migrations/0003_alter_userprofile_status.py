# Generated by Django 4.2.2 on 2023-07-01 14:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('c_auth', '0002_alter_userprofile_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='status',
            field=models.CharField(default='Пилот', max_length=30),
        ),
    ]