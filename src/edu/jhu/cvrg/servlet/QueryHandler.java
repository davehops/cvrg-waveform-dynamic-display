package edu.jhu.cvrg.servlet;

import java.io.IOException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import edu.jhu.cvrg.timeseriesstore.exceptions.OpenTSDBException;

/**
 * Servlet implementation class AutoCompleteServlet
 */
@WebServlet(asyncSupported = true, urlPatterns = { "/QueryHandler" })
public class QueryHandler extends HttpServlet {
	private static final long serialVersionUID = 1L;
	//private ComposerData compData = new ComposerData();
	//private HashMap composers = compData.getComposers();
	private ServletContext context;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public QueryHandler() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
	    this.context = config.getServletContext();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String action = request.getParameter("action");
		String targetId = request.getParameter("id");
		String subjectId = request.getParameter("subjectid");
	    long unixStart = Long.parseLong(request.getParameter("start"));
	    long unixEnd = Long.parseLong(request.getParameter("end"));
	    long graphWidth = Long.parseLong(request.getParameter("gsize"));
	    String endTime = request.getParameter("end");
	    StringBuffer sb = new StringBuffer();
	    boolean namesAdded = false;

	        // check if user sent empty string
	    
		String resultT = "";
	    	
    	TSDBBacking tdb = new TSDBBacking();
		long sampSecs = Math.max(((unixEnd - unixStart) / graphWidth), 1);
		String sampUnit = "s";
		if (sampSecs >= 60){
			sampSecs = sampSecs / 60;
			sampUnit = "m";
		}
		String downsampleRate = Long.toString(sampSecs) + sampUnit + "-avg";
		try {
			resultT = tdb.retrieveSingleLead(subjectId, targetId, unixStart, unixEnd, downsampleRate).toString();
			namesAdded = true;
		} catch (OpenTSDBException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	   

        if (namesAdded) { // boolean to test if there was any addition to the response
            response.setContentType("text/xml");
            response.setHeader("Cache-Control", "no-cache");
            response.getWriter().write("<rawdata>" + resultT + "</rawdata>");
        } else {
            //nothing to show
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        }

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
