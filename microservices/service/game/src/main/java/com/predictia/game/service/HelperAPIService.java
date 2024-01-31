package com.predictia.game.service;

import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class HelperAPIService {
    private String DATA_API_URL = "http://localhost:5000";
    private String EXTERNAL_API_URL = "https://api.football-data.org/";
    private String EXTERNAL_API_KEY = "7dcfc4cf6b4f4a2eb607ed5ef6f2705d";

    /**
     * Envoie une requête GET à l'API spécifié.
     *
     * @param target_URL ciblage URL Valeur possible: ["EXT","DATA"].
     * @param endpoint   l'endpoint de l'API.
     * @return la réponse de l'API au format JSONObject.
     */
    public JSONObject callAPI(String target_URL, String endpoint) {
        HttpResponse<String> response = null;
        JSONObject responseJSONObject = new JSONObject();

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request;
            if (target_URL.contains("EXT")) {
                target_URL = EXTERNAL_API_URL;
                request = HttpRequest.newBuilder()
                        .uri(URI.create(target_URL + endpoint))
                        .header("X-Auth-Token", EXTERNAL_API_KEY)
                        .build();
            } else if (target_URL.contains("DATA")) {
                target_URL = DATA_API_URL;
                request = HttpRequest.newBuilder()
                        .uri(URI.create(target_URL + endpoint))
                        .build();
            } else {
                System.out.println("Error no target_URL corresponding to your first parameter, please select one of [\"EXT\",\"DATA\"] as first parameter. If the first parameter is correct, verify the API_KEY");
                return responseJSONObject;
            }
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());
            } catch (IOException | InterruptedException e) {
                System.out.println("Error while executing request");
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.out.println("Error while creating request");
            e.printStackTrace();
        }

        try {
            if (response != null) {
                responseJSONObject = new JSONObject(response.body());
            }
        } catch (JSONException e) {
            try {
                responseJSONObject.put("data", new JSONArray(response.body()));
                return responseJSONObject;
            } catch (JSONException e1) {
                System.out.println("Error while parsing response");
                e.printStackTrace();
                return responseJSONObject;
            }
        }
        return responseJSONObject;
    }
}
