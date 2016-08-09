package edu.jhu.cvrg.servlet;
/*
Copyright 2015 Johns Hopkins University Institute for Computational Medicine

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**
* @author Chris Jurado, Stephen Granite
*/

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import edu.jhu.cvrg.timeseriesstore.exceptions.OpenTSDBException;
import edu.jhu.cvrg.timeseriesstore.opentsdb.TimeSeriesRetriever;


@WebServlet(urlPatterns = { "/TSDBBacking" })
public class TSDBBacking extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	final String OPENTSDB_HOST = "10.162.38.224";
	final String OPENTSDB_URL = "http://"+OPENTSDB_HOST+":4242";
	final Boolean OPENTSDB_BOO = true;
    
    public void pause(){
    	try {
			Thread.currentThread().sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
    }
   
    public String retrieveSingleLead(String subjectId, String metric, long unixTimeStart, long unixTimeEnd, String downsampleRate) throws OpenTSDBException{
    	//pause();
    	HashMap<String, String> tags = new HashMap<String, String>();
    	if (metric.startsWith("ecg")){
        	tags.put("subjectId", subjectId);
    	}
    	JSONObject dataForView;
	    String finalDataString = "";
    	//Interval Annotation result is {"tsuid":"00005900000200036A00000400036B","description":"Test Annotation 20160405 - 
    	//text for additional interval notation","notes":"","endTime":1420070467,"startTime":1420070465}
		try {
			dataForView = TimeSeriesRetriever.getDownsampledTimeSeries(OPENTSDB_URL, unixTimeStart, unixTimeEnd, metric, downsampleRate, tags, OPENTSDB_BOO);
	    	
			double sampRate = 1;
			double aduGain = 1;
			JSONObject rawData = new JSONObject();
			String leadMetric = "";
			JSONObject leadTags = new JSONObject();

			//System.out.println(dataForView);
    		rawData = dataForView.getJSONObject("dps");
    		leadMetric = dataForView.getString("metric");
    		leadTags = dataForView.getJSONObject("tags");
    		
    		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSS");
    		
//    		if (leadMetric != null){
//    			//System.out.println(leadMetric + ": lead Metric");
//			}

			if (!leadTags.isNull("format")){
				String value = leadTags.getString("format");
				switch (value.toLowerCase()) {
			        case "phillips103":
			            sampRate = 2;  // 1000 / 500 (original sample rate)
			            aduGain = 2;
			            break;
			        case "phillips104":
			            sampRate = 2;
			            aduGain = 2;
			            break;
			        case "schiller":
			        	sampRate = 2;
			            aduGain = 2;
			            break;
			        case "hl7aecg":
			        	sampRate = 1;  // 1000 / 1000 (original sample rate)
			            aduGain = 0.025;
			            break;
			        case "gemusexml":
			        	sampRate = 4;  // 1000 / 250 (original sample rate)
			            aduGain = 2.05;
			            break;
			        default: 
			            break;
			    }
			}
			
    		if (rawData != null){
    			TreeMap<String,String> map = new TreeMap<String,String>();
    			Iterator iter = rawData.keys();
    			while(iter.hasNext()){
			        String key = (String)iter.next();
			        Long onggg = (long) (Long.parseLong(key)*sampRate);
			        
			        // need to scale time appropriately for ecg leads
			        
			        Date time = new Date(onggg);
			        String reportDate = df.format(time);
			        //String shortKey = key.substring(5);
			        Long numValue = (long) (Long.parseLong(rawData.getString(key)) * aduGain);
					
			        String value = String.valueOf(numValue);
			        map.put(reportDate,value);
			    }
    			int counterR = 0;
    			for(Map.Entry<String, String> entry : map.entrySet()){
    				counterR++;
    				String k = entry.getKey();
    				String v = entry.getValue();
    				finalDataString += "[" + k + "," + v + "],";
    			}
    			System.out.println(":" + counterR + ": " + finalDataString);
    			//System.out.println(":" + counterR + ": " + finalDataString);
    			if (finalDataString.charAt(finalDataString.length()-1)==',') {
    				finalDataString = finalDataString.substring(0, finalDataString.length()-1);
    			}
    		}

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return finalDataString;
		
    }
    
    
}
