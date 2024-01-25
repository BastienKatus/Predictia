import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import TwoHandleSliderRangeInput from "./TwoHandleSliderRangeInput";
import Loading from "./Loading";

const Simulation = (props) => {

  const [isLoading, setIsLoading] = useState(false);

  const [sectionSimulation, setSectionSimulation] = useState(false);
  const [sectionBet, setSectionBet] = useState(false);

  const [teamList, setTeamList] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [selectedHomeLeague, setSelectedHomeLeague] = useState('');
  const [selectedAwayLeague, setSelectedAwayLeague] = useState('');
  const [homeLeagueList, setHomeLeagueList] = useState([]);
  const [awayLeagueList, setAwayLeagueList] = useState([]);
  const [filteredHomeTeamList, setFilteredHomeTeamList] = useState([]);
  const [filteredAwayTeamList, setFilteredAwayTeamList] = useState([]);
  const [zonesValues, setZonesValues] = useState([0, 100]);
  const [bet, setBet] = useState(10);

  const [predictionResult, setPredictionResult] = useState(null);

  const dataReducer = useSelector(state => state.dataReducer)
  const userReducer = useSelector(state => state.userReducer);

  useEffect(() => {
    setTeamList(dataReducer.teams)
  }, [dataReducer.teams]);

  useEffect(() => {
    const filteredCompetitions = dataReducer.competitions.filter(
      (league) => league.competitionId === 'ES1' || league.competitionId === 'FR1' || league.competitionId === 'NL1' || league.competitionId === 'PO1' || league.competitionId === 'IT1' || league.competitionId === 'L1' || league.competitionId === 'GB1'
    );
    setHomeLeagueList(filteredCompetitions);
    setAwayLeagueList(filteredCompetitions);
  }, [dataReducer.competitions]);

  useEffect(() => {
    if (selectedHomeLeague === "") {
      setFilteredHomeTeamList(dataReducer.teams)
    } else {
      const filteredTeams = teamList.filter(
        (team) => selectedHomeLeague !== '' && team.domesticCompetitionId === selectedHomeLeague
      );
      const sortedData = filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredHomeTeamList(sortedData);
    }
  }, [selectedHomeLeague]);

  useEffect(() => {
    if (selectedAwayLeague === "") {
      setFilteredAwayTeamList(dataReducer.teams)
    } else {
      const filteredTeams = teamList.filter(
        (team) => selectedAwayLeague !== '' && team.domesticCompetitionId === selectedAwayLeague
      );
      const sortedData = filteredTeams.sort((a, b) => a.name.localeCompare(b.name));
      setFilteredAwayTeamList(sortedData);
    }
  }, [selectedAwayLeague]);

  useEffect(() => {
  }, [predictionResult]);

  const handleZonesChange = (newValues) => {
    setZonesValues(newValues);
  };

  const handleBetChange = (e) => {
    setBet(e.target.value);
  };

  const handleHomeLeagueChange = (e) => {
    setSelectedHomeLeague(e.target.value);
  };

  const handleAwayLeagueChange = (e) => {
    setSelectedAwayLeague(e.target.value);
  };

  const handleHomeTeamChange = (e) => {
    setHomeTeam(e.target.value);
  };

  const handleAwayTeamChange = (e) => {
    setAwayTeam(e.target.value);
  };

  const handleApplyPrediction = (e) => {
    setIsLoading(true)
    let predictionURL = "/soccerManager/games/predict?homeTeamId=" + homeTeam + "&awayTeamId=" + awayTeam;
    fetch(predictionURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log("json", json);
        setPredictionResult(json);
        setIsLoading(false)
      })
  };

  const handleBetAgainstIA = (e) => {
    setIsLoading(true)
    if (userReducer.userId && homeTeam && awayTeam) {
      fetch("/game/betgames/bet", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userId": userReducer.userId,
          "clubHomeId": homeTeam,
          "clubAwayId": awayTeam,
          "betWinHomeClub": zonesValues[0] / 100,
          "betWinAwayClub": zonesValues[1] / 100,
          "betDraw": (100 - zonesValues[1] - zonesValues[0]) / 100,
          "bet": bet
        }),
      })
        .then(response => response.json())
        .then(json => {
          console.log("json", json);
          let predictionResult = {
            "probabilite_victoire": json['predictionResultWinHomeClub'],
            "probabilite_nul": json['predictionResultDraw'],
            "probabilite_defaite": json['predictionResultWinAwayClub']
          }
          setPredictionResult(predictionResult);
          setIsLoading(false)
        })
    }
  };

  const handleClickSectionSimulation = () => {
    setSectionSimulation(true);
    setSectionBet(false);
  };

  const handleClickSectionBet = () => {
    setSectionSimulation(false);
    setSectionBet(true);
  };

  return (
    <div id={"simulation"}>
      <h2> Je personnalise mon match </h2>
      <div className={"select_home_away_team"}>
        <div className={"home_team"}>
          <label>
            Ligue de l'équipe à domicile:
            <select value={selectedHomeLeague} onChange={handleHomeLeagueChange}>
              <option value="">Toutes les ligues</option>
              {homeLeagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Equipe domicile :
            <select onChange={handleHomeTeamChange}>
              <option value="">Sélectionner l'équipe à domicile</option>
              {filteredHomeTeamList.map((team) => (
                <option key={team.clubId} value={team.clubId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={"away_team"}>
          <label>
            Ligue de l'équipe visiteur:
            <select value={selectedAwayLeague} onChange={handleAwayLeagueChange}>
              <option value="">Toutes les ligues</option>
              {homeLeagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Equipe visiteur :
            <select onChange={handleAwayTeamChange}>
              <option value="">Sélectionner l'équipe des visiteurs</option>
              {filteredAwayTeamList.map((team) => (
                <option key={team.clubId} value={team.clubId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <Loading isLoading={isLoading}/>
      <div className={"main-section"}>
        <div className={`${sectionSimulation ? 'isActive' : 'isDisactive'}`} onClick={handleClickSectionSimulation}>
          <h2>
            Predictia
          </h2>
          <div className={"detail"}>
            Explication de comment cela fonctionne rapidement
          </div>

          <button onClick={handleApplyPrediction}>Simulation simple</button>
        </div>

        <div className={`${sectionBet ? 'isActive' : 'isDisactive'}`} onClick={handleClickSectionBet}>
          <h2>
            Jouer contre Predictia
          </h2>

          <div className={"detail"}>
            <p>
              {"Les résultats sont distribués de la manière suivante:"}
            </p>
            <p>
              {"Si le joueur annonce Victoire de A ou de B à 60% et plus alors cela ajoute un coefficient plus fort pour la victoire de l'équipe annoncé."}
            </p>
            <p>
              {"Si le joueur annonce aucune des deux équipes avec un pourcentage de victoire > 60 et <40 ou un match nul > 20 alors c’est considéré comme un match nul. Un coefficient est ajouté pour le match nul."}
            </p>
            <p>
              {"Les crédits redistribué sont équivalent à mise de départ X coefficient."}
            </p>
            <p>
              {"coefficient = +2 pour une victoire d'équipe"}
            </p>
            <p>
              {"coefficient = +3 pour un match nul"}
            </p>
            <p>
              {"coefficient -= |PredictionA - JoueurA| +|PredictionNul - JoueurNul| + |PredictionB - JoueurB|"}
            </p>
            <p>
              {"Si tous les résultats sont exacts, alors cela fait X10 de la mise."}
            </p>
          </div>

          <label>
            Montant de votre mise :
            <input type="number" value={bet} onChange={handleBetChange}/>
          </label>

          <TwoHandleSliderRangeInput values={zonesValues} onChange={handleZonesChange}/>

          <button onClick={handleBetAgainstIA}>Parier contre l'IA</button>
        </div>
      </div>
      {
        predictionResult && predictionResult.probabilite_nul && (
          <div className={"result"}>
            <h2>
              Résultat prédit par notre IA
            </h2>
            <div className="percentage-bar">
              <div className="percentage" style={{width: `${predictionResult.probabilite_victoire * 100}%`}}>
                {Math.round(predictionResult.probabilite_victoire * 100)}%
              </div>
              <div className="percentage2" style={{width: `${predictionResult.probabilite_nul * 100}%`}}>
                {Math.round(predictionResult.probabilite_nul * 100)}%
              </div>
              <div className="percentage3" style={{width: `${predictionResult.probabilite_defaite * 100}%`}}>
                {Math.round(predictionResult.probabilite_defaite * 100)}%
              </div>
            </div>
          </div>
        )
      }
    </div>
  )


    ;
};

export default Simulation;