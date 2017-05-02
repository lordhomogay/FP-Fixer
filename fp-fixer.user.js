// ==UserScript==
// @name            FPFixer
// @namespace       lordhomogay
// @version         1.1
// @description     Provides various changes to facepunch.com
// @match           facepunch.com/*
// @match           www.facepunch.com/*
// ==/UserScript==

//todo
//convert all strings in settings object to booleans
//temphtml = temphtml.replace(settings[toToggle], !settings[toToggle]); // this line should make the if/else statement unnecessary
//continue trying to improve the fpfOptionsMenu generation code. it's butt ugly

if (!localStorage.fpfSettings){
	var settings = {
		navbar: "true",
		logo: "true",
		logoutButton: "true",
		notablePosts: "true",
		ignoreLink: "true",
		threadTitleHighlight: "true",
		enhancedIgnore: "true",
		resizeUserTitles: "true",
		doubleColumn: "true",
		highlightLast: "true",
		ignoredUsers: '["AEGDanuta"]'	};	//this is the easiest way to prevent a JSON parsing error. user AEGDanuta is a spambot, not a legitimate user
	localStorage.setItem("fpfSettings", JSON.stringify(settings));
	alert("Facepunch Fixer initialized. Be sure to adjust the settings in the new navbar link");
	location.reload();	}

var settings = JSON.parse(localStorage.getItem("fpfSettings"));
settings.ignoredUsers = JSON.parse(settings.ignoredUsers);
var currentPage = window.location.href.replace("www.", "");
var html, runOnce = false;

$.ajax({
	url: 'https://cdn.rawgit.com/lordhomogay/FP-Fixer/a1f0eafd/options.html',
	cache: false,
	success: function(data) {
		html = data;	}
});

function fpfToggle(toToggle){
	temphtml = $("#fpf"+toToggle).html();

	if (settings[toToggle]  === "true"){
		temphtml = temphtml.replace("true", "false");
		$("#fpf"+toToggle).css("background-color", "rgba(246, 201, 204, 0.5)");
		settings[toToggle] = "false";	}
	else if (settings[toToggle]  === "false"){
		temphtml = temphtml.replace("false", "true");
		$("#fpf"+toToggle).css("background-color", "rgba(110, 255, 122, 0.5)");
		settings[toToggle] = "true";	}

	$("#fpf"+toToggle).html(temphtml);
	if (!runOnce)
		settings.ignoredUsers = JSON.stringify(settings.ignoredUsers);	runOnce = true;	//this must be done to preserve proper JSON formatting
	localStorage.setItem("fpfSettings", JSON.stringify(settings));
}


$("#navbarlinks").append("<span id='fpfOptions' class='navbarlink fakeClick' style='float:left; padding-right:1em; cursor: pointer'><img src='/fp/ratings/information.png' />FPF Options</span>");
$("#fpfOptions").click(function(){
	CreateFloatingDiv(MouseX, MouseY, "fpfOptionsMenu", "urlBox");
	fpfOptionsMenu.innerHTML = html;	//holy fuck i know this is ugly
	$("#fpfnavbar").append(settings.navbar);
		$("#fpfnavbar").click(function(){ fpfToggle("navbar"); });
	$("#fpflogo").append(settings.logo);
		$("#fpflogo").click(function(){ fpfToggle("logo"); });
	$("#fpflogoutButton").append(settings.logoutButton);
		$("#fpflogoutButton").click(function(){ fpfToggle("logoutButton"); });
	$("#fpfnotablePosts").append(settings.notablePosts);
		$("#fpfnotablePosts").click(function(){ fpfToggle("notablePosts"); });
	$("#fpfignoreLink").append(settings.ignoreLink);
		$("#fpfignoreLink").click(function(){ fpfToggle("ignoreLink"); });
	$("#fpfthreadTitleHighlight").append(settings.threadTitleHighlight);
		$("#fpfthreadTitleHighlight").click(function(){ fpfToggle("threadTitleHighlight"); });
	$("#fpfenhancedIgnore").append(settings.enhancedIgnore);
		$("#fpfenhancedIgnore").click(function(){ fpfToggle("enhancedIgnore"); });
	$("#fpfresizeUserTitles").append(settings.resizeUserTitles);
		$("#fpfresizeUserTitles").click(function(){ fpfToggle("resizeUserTitles"); });
//	$("#fpfProfileMessageDeleted").append(localStorage.getItem("fpfProfileMessageDeleted"));
//		$("#fpfProfileMessageDeleted").click(function(){ fpfToggle("fpfProfileMessageDeleted"); });
	$("#fpfdoubleColumn").append(settings.doubleColumn);
		$("#fpfdoubleColumn").click(function(){ fpfToggle("doubleColumn"); });
	$("#fpfhighlightLast").append(settings.highlightLast);
		$("#fpfhighlightLast").click(function(){ fpfToggle("highlightLast"); });
/*	for (i=0; i<settings.length; i++){		//i have no clue why this doesn't work
		 = settings[i];
		$("#"+fpf).append(localStorage.getItem(fpf));
		$("#"+fpf).click(function(){ toggle(fpf); });	}	*/
	$("#fpfupdateIgnored").css("background-color", "rgba(0, 205, 255, 0.5)");
		$("#fpfupdateIgnored").click(function(){ window.location.href ="/profile.php?do=ignorelist"; });
	$("#fpfOptionsMenu").children(":contains('true')").css("background-color", "rgba(110, 255, 112, 0.5");
	$("#fpfOptionsMenu").children(":contains('false')").css("background-color", "rgba(246, 201, 204, 0.5");
	$("#fpfOptionsMenu").children(".fakeLink").hover(function(){	$(this).fadeTo(0, 0.5);	},	function(){	$(this).fadeTo(0, 1.0);	});
	$("#fpfOptionsMenu .fakeLink").css({
		"margin-bottom": "2px",
		"cursor": "pointer",
		"font-size": "11px"	});
});
$("#fpfOptions").click();	//this fixes the double click bug

if (settings.navbar === "true")
	$("#navbarlinks").prepend("<div class='navbarlink'><a href='/fp_ticker.php'><img src='/fp/navbar/ticker.png'/>Ticker</a></div>");

if (settings.logo === "true")
	$("#logo").children().children().attr("src", "https://cdn.rawgit.com/lordhomogay/FP-Fixer/1491d84c/fplogo.png");

if(SECURITYTOKEN != "guest" && settings.logoutButton === "true")
	$(".footer_links").prepend("<a href='login.php?do=logout&logouthash="+SECURITYTOKEN+"'>Logout</a> - ");

if (currentPage.indexOf("showthread.php") >= 0){
	var	username = $("#navbar-login").find("strong").text();

	$("#posts li").each(function(){	//puts an ignore link in the postbit, highlights notable usergroups
		usergroup = $(this).find("a.username");
		if (settings.notablePosts === "true"){
			if (usergroup.html().indexOf(">garry</") >= 0)					//garry -- the brackets around the name ensure that only the correct garry is highlighted
				$(this).find(".postdetails, .postfoot").css("background", "rgba(185, 211, 238, 0.7)");
			else if (usergroup.html().indexOf("color:rgb(0, 112, 255)") >= 0 )	//dev member
				$(this).find(".postdetails, .postfoot").css("background", "rgba(0, 205, 255, 0.7)");
			else if (usergroup.html().indexOf("color:#00aa00") >= 0)			//green member
				$(this).find(".postdetails, .postfoot").css("background", "rgba(110, 255, 112, 0.7)");
			//else if (usergroup.html().indexOf("#A06000") >= 0)					//gold member
				//$(this).find(".postdetails, .postfoot").css("background", "rgba(255, 239, 153, 0.7)");
			//else if (usergroup.html().indexOf("color=\"red\"") >= 0)			//red member
				//$(this).find(".postdetails, .postfoot").css("background", "rgba(246, 201, 204, 0.7)");
			//else 																//none of the above, either a usergroup i forgot or a blue member
			//$(this).find(".postdetails, .postfoot").css("background", "rgba(255, 255, 255, 0.6)");

			if (usergroup.html().indexOf(username) >= 0)
				$(this).find(".postdetails, .postfoot").css("background", "rgba(238, 255, 188, 1.0)");
		}

		if (settings.ignoreLink === "true" && usergroup.html().indexOf(username) == -1){
			posterid = $(this).find("a.username").attr("href");
			posterid = posterid.replace("member.php?u=", "");
			$(this).find(".postlinking").append("<a href='profile.php?do=addlist&userlist=ignore&u="+posterid+"' target='_blank'><img src='https://cdn.rawgit.com/lordhomogay/FP-Fixer/9bd357bf/ignore.png'/ title='Ignore User'></a>");	}
	});

	if (settings.threadTitleHighlight === "true")
		$("#lastelement").css({ "color": "#FF0000", "font-weight": "bold" });	//makes thread titles glowy and red

	if (settings.highlightLast === "true")
		$(".postcontainer").last().find(".posthead").css("background", "rgba(34, 136, 255, 1.0)");

	if (settings.enhancedIgnore === "true"){
		$(".postbitignored").each(function(){
			$(this).fadeTo(0, 0.1);
			$(this).hover(function(){	$(this).fadeTo(300, 1);	},	function(){	$(this).fadeTo(300, 0.1);	}); 	});
	}

	if (settings.resizeUserTitles === "true"){	//Code by luastoned (https://facepunch.com/member.php?u=118944)
		var userTitles = document.getElementsByClassName("usertitle");
		for (var i = 0; i < userTitles.length; i++){
			userTitles[i].style.fontSize = "10px";
			var fontTags = userTitles[i].getElementsByTagName("font");
			for (var j = 0; j < fontTags.length; j++)
				fontTags[j].setAttribute("size", 1);	}
	}
}

//else if (currentPage.indexOf("member.php") >= 0 && localStorage.getItem("fpfProfileMessageDeleted") === "true"){	//code found on a post from Teddybeer
//	$("li:contains('This message has been deleted by')").remove();	}

else if (currentPage.indexOf("/members/") >= 0){	//for some reason fp uses two syntaxes for profiles. clicking an avatar on forumhome.php uses this syntax, nothing else that i know of uses it.
	window.location.href=currentPage.replace("members/", "member.php?u=");	}

else if ( (currentPage.indexOf("forum.php") >= 0 || currentPage == ("https://facepunch.com/")) && settings.doubleColumn === "true"){	//Code posted by Baboo00 -- https://goo.gl/mSlBfW
	$(".forums").first().next().nextAll().appendTo($("<td valign='top' class='FrontPageForums'></td>").insertAfter(".FrontPageForums"));
	$(".FrontPageForums").css("padding", "5px");
    $(".last_post_column").css("max-width", "200px");
    $(".last_post_column").css("min-width", "200px");	}

else if (currentPage.indexOf("profile.php?do=ignorelist") >= 0 && settings.enhancedIgnore === "true"){
	ignoreList = [];
	$("#ignorelist").children("li").children("a").each(function(){ ignoreList.push($(this).text()); });
	settings.ignoredUsers = JSON.stringify(ignoreList);
	localStorage.setItem("fpfSettings", JSON.stringify(settings));
	alert("FP Fixer ignore list updated");	}

else if ( (currentPage.indexOf("forumdisplay.php") >=0 || currentPage.indexOf("fp_popular.php") >=0 || currentPage.indexOf("fp_read.php") >= 0) && settings.enhancedIgnore === "true"){
	for (i=0; i<settings.ignoredUsers.length; i++) {
		$(".author:contains("+settings.ignoredUsers[i]+")").parent().parent().parent().parent().fadeTo(0, 0.1);
		$(".author:contains("+settings.ignoredUsers[i]+")").parent().parent().parent().parent().hover(function(){	$(this).fadeTo(300, 1);	},	function(){	$(this).fadeTo(300, 0.1);	});	}
}

else if ( (currentPage.indexOf("profile.php?do=doaddlist&list=") >=0 || currentPage.indexOf("profile.php?do=doremovelist&list=&userid=") >=0) && settings.enhancedIgnore === "true")
	alert("Be sure to click \"update ignored users\" in the FPF Options menu!");

console.info("FP Fixer completed successfully");
