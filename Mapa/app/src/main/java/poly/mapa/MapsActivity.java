package poly.mapa;

import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback
{
    private GoogleMap mMap;
    ArrayList<String> Addresses = new ArrayList<>();
    ArrayList<String> Ratings = new ArrayList<>();
    ArrayList<String> Names = new ArrayList<>();
    ArrayList<String> IDs = new ArrayList<>();
    String ID = "";
    String aux = "";
    TextView name, address;
    ProgressBar placeRating;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        name =  findViewById(R.id.placeName);
        address = findViewById(R.id.placeAddress);
        placeRating =findViewById(R.id.placeRating); // initiate the progress bar
    }
    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String JsonURL = "http://ad09a5c9.ngrok.io/getAllPlaces";

        JsonArrayRequest obreq = new JsonArrayRequest(Request.Method.GET, JsonURL, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            for(int i=0; i < response.length(); i++){
                                JSONObject obj = response.getJSONObject(i);
                                Names.add(obj.getString("placeName"));
                                Addresses.add(obj.getString("placeAddress"));
                                Ratings.add(obj.getString("placeRating"));
                                IDs.add(obj.getString("_id"));
                                String placeLatitude = obj.getString("placeLatitude");
                                String placeLongitude = obj.getString("placeLongitude");
                                mMap.addMarker(new MarkerOptions().position(new LatLng(Double.parseDouble(placeLatitude),Double.parseDouble(placeLongitude))).title(Names.get(Names.size() - 1)).snippet(Addresses.get(Addresses.size() - 1)));
                            }
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.e("Volley", error.toString());
                    }
                }

        );
        mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                aux = marker.getTitle();
                for(int i = 0; i < Names.size(); i++){
                    if(aux.equals(Names.get(i))){
                        name.setText(Names.get(i));
                        address.setText(Addresses.get(i));
                        placeRating.setProgress(Math.round(Float.parseFloat(Ratings.get(i))));
                        ID = IDs.get(i);
                    }
                }
                return false;
            }
        });
        requestQueue.add(obreq);
        LatLng mtl = new LatLng(45.5017, -73.5673);
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(mtl, 12.0f));

        new Thread(new Task()).start();
    }

    class Task implements Runnable{
        @Override
        public void run(){
            while(true) {
                try {
                    Thread.sleep(3000);
                    updateRatings();
                }catch (InterruptedException e) {
                e.printStackTrace();
                }
            }
        }
    }

   public void sendData(View view){

       RequestQueue requestQueue = Volley.newRequestQueue(this);
       String JsonURL = "http://ad09a5c9.ngrok.io/updateRating/" + ID;

       JsonArrayRequest obreq = new JsonArrayRequest(Request.Method.GET, JsonURL, null,
               new Response.Listener<JSONArray>() {
                   @Override
                   public void onResponse(JSONArray response) {
                       try {
                               JSONObject obj = response.getJSONObject(0);
                               String nName = obj.getString("placeName");
                               String nRating = obj.getString("placeRating");
                               for(int i = 0; i < Names.size(); i++){
                                   if(nName.equals(Names.get(i))){
                                       Ratings.set(i, nRating);
                                       placeRating.setProgress(Math.round( (Float.parseFloat(Ratings.get(i)) * 10)));
                                   }
                               }
                       }
                       catch (JSONException e) {
                           e.printStackTrace();
                       }

                   }
               },
               new Response.ErrorListener() {
                   @Override
                   public void onErrorResponse(VolleyError error) {
                       Log.e("Volley", error.toString());
                   }
               }
       );
       requestQueue.add(obreq);
   }

   public void updateRatings(){
       RequestQueue requestQueue = Volley.newRequestQueue(this);
       String JsonURL = "http://ad09a5c9.ngrok.io/getAllPlaces";

       JsonArrayRequest qqqq = new JsonArrayRequest(Request.Method.GET, JsonURL, null,
               new Response.Listener<JSONArray>() {

                   // Takes the response from the JSON request
                   @Override
                   public void onResponse(JSONArray response) {
                       try {
                           for(int i=0; i < response.length(); i++){
                               JSONObject obj = response.getJSONObject(i);
                               String nName = obj.getString("placeName");
                               String nRating = obj.getString("placeRating");
                               if(nName.equals(Names.get(i))) {
                                   Log.e("Updating", nName + nRating);
                                   Ratings.set(i, nRating);
                                   Log.e("Updating", Ratings.get(i));
                                   if(aux.equals(Names.get(i))){
                                       placeRating.setProgress(Math.round( (Float.parseFloat(Ratings.get(i)) * 10)));
                                   }
                               }
                           }
                       }
                       catch (JSONException e) {
                           e.printStackTrace();
                       }
                   }
               },
               new Response.ErrorListener() {
                   @Override
                   public void onErrorResponse(VolleyError error) {
                       Log.e("Volley", error.toString());
                   }
               }
       );
       requestQueue.add(qqqq);
   }
}
