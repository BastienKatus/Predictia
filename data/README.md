# Machine learning pour prédire le résultat entre deux équipes 

## Fonctionnement
* Le dossier "flask_app" contient le script python permettant de récupérer le résultat entre deux équipes. Cette API est développée à l'aide de la librairie flask.
* Le dossier "model_training" concerne l'entrainement du model et détermine la stratégie adoptée pour la prédiction entre deux matchs. Ce dossier contient également les sources de données qu'il faudra mettre à jour chaque semaine.

## Configuration
Il est nécessaire de réaliser les configurations suivantes pour travailler sur le model ainsi que sur l'API.

### Configuration de l'environnement
* Pour exporter l'environnement : python -m pip freeze > requirements.txt
* Pour activer l'environnement : predictia_env\Scripts\activate
* Pour installer l'environnement, il faut : 
    * Créer l'environnement : python -m venv predictia_env
    * Activer l'environnement : predictia_env\Scripts\activate
    * Installer les dépendances : python -m pip install -r requirements.txt

### Pour travailler sur le modèle 
* Se rendre dans le dossier "model_training" ;
* Lancer la commande : jupyter notebook ;
* Travailler sur le fichier PredictiaML.

### Lancement de l'API Flask 
...

