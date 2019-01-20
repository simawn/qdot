package poly.mapa;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.EOFException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback
{

    private GoogleMap mMap;
    ArrayList<String> Addresses = new ArrayList<String>();
    ArrayList<String> Ratings = new ArrayList<String>();
    ArrayList<String> Names = new ArrayList<String>();
    ArrayList<String> IDs = new ArrayList<String>();
    String ID = "";
    TextView name, address, rating;
    ProgressBar placeRating;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        name = (TextView) findViewById(R.id.placeName);
        address = (TextView) findViewById(R.id.placeAddress);
        placeRating =(ProgressBar)findViewById(R.id.placeRating); // initiate the progress bar
        placeRating.setMax(5); // 100 maximum value for the progress value


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

        // Casts results into the TextView found within the main layout XML with id jsonData
        //String name, address, rating;

        // Creating the JsonObjectRequest class called obreq, passing required parameters:
        //GET is used to fetch data from the server, JsonURL is the URL to be fetched from.
        JsonArrayRequest obreq = new JsonArrayRequest(Request.Method.GET, JsonURL, null,
                // The third parameter Listener overrides the method onResponse() and passes
                //JSONObject as a parameter
                new Response.Listener<JSONArray>() {

                    // Takes the response from the JSON request
                    @Override
                    public void onResponse(JSONArray response) {
                        try {
                            /*JSONObject obj = response.getJSONObject(0);
                            String color = obj.getString("userId");
                            String desc = obj.getString("title");
                            data += "Color Name: " + color +
                                    "nDescription : " + desc;
                            results.setText(data);*/
                            for(int i=0; i < response.length(); i++){
                                JSONObject obj = response.getJSONObject(i);
                                Names.add(obj.getString("placeName"));
                                Addresses.add(obj.getString("placeAddress"));
                                Ratings.add(obj.getString("placeRating"));
                                IDs.add(obj.getString("_id"));
                                String placeLatitude = obj.getString("placeLatitude");
                                String placeLongitude = obj.getString("placeLongitude");
                                //String placeID = obj.getString("_id");
                                LatLng point = new LatLng(Double.parseDouble(placeLatitude), Double.parseDouble(placeLongitude));
                                mMap.addMarker(new MarkerOptions().position(new LatLng(Double.parseDouble(placeLatitude),Double.parseDouble(placeLongitude))).title(Names.get(Names.size() - 1)).snippet(Addresses.get(Addresses.size() - 1)));


                            }
                        }
                        // Try and catch are included to handle any errors due to JSON
                        catch (JSONException e) {
                            // If an error occurs, this prints the error to the log
                            e.printStackTrace();
                        }
                    }
                },
                // The final parameter overrides the method onErrorResponse() and passes VolleyError
                //as a parameter
                new Response.ErrorListener() {
                    @Override
                    // Handles errors that occur due to Volley
                    public void onErrorResponse(VolleyError error) {
                        Log.e("Volley", error.toString());
                    }
                }

        );
        mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                Toast.makeText(MapsActivity.this, "Inside", Toast.LENGTH_SHORT).show();
                String aux = marker.getTitle();
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
        // Adds the JSON object request "obreq" to the request queue
        requestQueue.add(obreq);


        // Add a marker in Sydney and move the camera
        LatLng mtl = new LatLng(45.5017, -73.5673);
//        mMap.moveCamera(CameraUpdateFactory.newLatLng(mtl));
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(mtl, 12.0f));

    }

   /* @Override
    public boolean onMarkerClick(final Marker marker) {
        Toast.makeText(this, "Inside", Toast.LENGTH_SHORT).show();
        String aux = marker.getTitle();
        for(int i = 0; i < Names.size(); i++){
            if(aux.equals(Names.get(i))){
                name.setText(Names.get(i));
                address.setText(Addresses.get(i));
                rating.setText(Ratings.get(i));
            }
        }
        return true;
    }*/

   public void sendData(View view){
       String JsonURL = "http://ad09a5c9.ngrok.io/updateRating";
       RequestQueue requestQueue = Volley.newRequestQueue(this);
       JSONObject postparams = new JSONObject();
       try{
           postparams.put("placeID", ID);
       }catch (JSONException e) {
           // If an error occurs, this prints the error to the log
           e.printStackTrace();
       }

       JsonObjectRequest jsonObjReq = new JsonObjectRequest(Request.Method.POST,
               JsonURL, postparams,
               new Response.Listener<JSONObject>() {
                   @Override
                   public void onResponse(JSONObject response) {
                       //Success Callback
                       Log.d("Response", response.toString());

                   }
               },
               new Response.ErrorListener() {
                   @Override
                   public void onErrorResponse(VolleyError error) {
                       //Failure Callback
                   }
               });
// Adding the request to the queue along with a unique string tag
       requestQueue.add(jsonObjReq);
   }



}
