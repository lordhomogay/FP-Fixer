// ==UserScript==
// @name            FPFixer
// @namespace       lordhomogay
// @version         1.0
// @description     Provides various changes to facepunch.com
// @match           facepunch.com/*
// @match           www.facepunch.com/*
// ==/UserScript==

if (!localStorage.fpfInit) {
	localStorage.setItem("fpfInit", "true");	localStorage.setItem("fpfNavbar", "true");
	localStorage.setItem("fpfLogo", "true");	localStorage.setItem("fpfLogoutButton", "true");
	localStorage.setItem("fpfNotablePosts", "true");	localStorage.setItem("fpfIgnoreLink", "true");
	localStorage.setItem("fpfThreadTitleHighlight", "true");	localStorage.setItem("fpfEnhancedIgnore", "true");
	localStorage.setItem("fpfResizeUserTitles", "true");	localStorage.setItem("fpfProfileMessageDeleted", "true");
	localStorage.setItem("fpfDoubleColumn", "true");	localStorage.setItem("fpfHighlightLast", "true");
	alert("FP Fixer initialized. Be sure to adjust the settings in the new navbar link.");
}

var currentPage = window.location.href.replace("www.", "");
var html;
var ignoredUsers;

$.ajax({
	url: 'https://cdn.rawgit.com/lordhomogay/FP-Fixer/acad0995/options.html',
	cache: false,
	success: function(data) {
		html = data;	}
});

function toggle(setting){
	if (localStorage.getItem(setting)  === "true"){
		temphtml = $("#"+setting).html();
		temphtml = temphtml.replace("true", "false");
		$("#"+setting).html(temphtml);
		$("#"+setting).css("background-color", "rgb(246, 201, 204)");
		localStorage.setItem(setting, "false");	}
	else if (localStorage.getItem(setting)  === "false"){
		temphtml = $("#"+setting).html();
		temphtml = temphtml.replace("false", "true");
		$("#"+setting).html(temphtml);
		localStorage.setItem(setting, "true");
		$("#"+setting).css("background-color", "rgb(110, 255, 122)");	}
}

function enhanceIgnore(){
	ignoredUsers = JSON.parse(localStorage.getItem("ignoredUsers"));
	for (i=0; i<ignoredUsers.length; i++)
		$(".author:contains("+ignoredUsers[i]+")").parent().parent().parent().parent().fadeTo(0, 0.15);	}


$("#navbarlinks").append("<span id='fpfOptions' class='navbarlink fakeLink' style='float:left; padding-right:1em'><img src='/fp/ratings/information.png' />FPF Options</span>");
$("#fpfOptions").click(function(){
	CreateFloatingDiv(MouseX, MouseY, "fpfOptionsMenu", "urlBox");
	fpfOptionsMenu.innerHTML = html;	//holy fuck i know this is ugly
	$("#fpfNavbar").append(localStorage.fpfNavbar);
		$("#fpfNavbar").click(function(){ toggle("fpfNavbar"); });
	$("#fpfLogo").append(localStorage.fpfLogo);
		$("#fpfLogo").click(function(){ toggle("fpfLogo"); });
	$("#fpfLogoutButton").append(localStorage.fpfLogoutButton);
		$("#fpfLogoutButton").click(function(){ toggle("fpfLogoutButton"); });
	$("#fpfNotablePosts").append(localStorage.fpfNotablePosts);
		$("#fpfNotablePosts").click(function(){ toggle("fpfNotablePosts"); });
	$("#fpfIgnoreLink").append(localStorage.fpfIgnoreLink);
		$("#fpfIgnoreLink").click(function(){ toggle("fpfIgnoreLink"); });
	$("#fpfThreadTitleHighlight").append(localStorage.fpfThreadTitleHighlight);
		$("#fpfThreadTitleHighlight").click(function(){ toggle("fpfThreadTitleHighlight"); });
	$("#fpfEnhancedIgnore").append(localStorage.fpfEnhancedIgnore);
		$("#fpfEnhancedIgnore").click(function(){ toggle("fpfEnhancedIgnore"); });
	$("#fpfResizeUserTitles").append(localStorage.fpfResizeUserTitles);
		$("#fpfResizeUserTitles").click(function(){ toggle("fpfResizeUserTitles"); });
	$("#fpfProfileMessageDeleted").append(localStorage.fpfProfileMessageDeleted);
		$("#fpfProfileMessageDeleted").click(function(){ toggle("fpfProfileMessageDeleted"); });
	$("#fpfDoubleColumn").append(localStorage.fpfDoubleColumn);
		$("#fpfDoubleColumn").click(function(){ toggle("fpfDoubleColumn"); });
	$("#fpfHighlightLast").append(localStorage.fpfHighlightLast);
		$("#fpfHighlightLast").click(function(){ toggle("fpfHighlightLast"); });
	$("#fpfUpdateIgnored").css("background-color", "rgba(0, 205, 255, 0.5)");
		$("#fpfUpdateIgnored").click(function(){ window.location.href ="/profile.php?do=ignorelist"; });
	$("#fpfOptionsMenu").children(":contains('true')").css("background-color", "rgba(110, 255, 112, 0.5");
	$("#fpfOptionsMenu").children(":contains('false')").css("background-color", "rgba(246, 201, 204, 0.5");
});

if (localStorage.getItem("fpfNavbar") === "true")
	$("#navbarlinks").prepend("<div class='navbarlink'><a href='/fp_ticker.php'><img src='/fp/navbar/ticker.png'/>Ticker</a></div>");

if (localStorage.getItem("fpfLogo") === "true")
	$("#logo").children().children().attr("src", "https://cdn.rawgit.com/lordhomogay/FP-Fixer/feature-test/fplogo.png");

if(SECURITYTOKEN != "guest" && localStorage.getItem("fpfLogoutButton") === "true")
	$(".footer_links").prepend("<a href='login.php?do=logout&logouthash="+SECURITYTOKEN+"'>Logout</a> - ");

if (currentPage.indexOf("showthread.php") >= 0){
	var	username = $("#navbar-login").find("strong").text();

	$("#posts li").each(function(){	//puts an ignore link in the postbit, highlights notable usergroups
		usergroup = $(this).find("a.username");
		if (localStorage.getItem("fpfNotablePosts") === "true"){
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

		if (localStorage.getItem("fpfIgnoreLink") === "true" && usergroup.html().indexOf(username) == -1){
			posterid = $(this).find("a.username").attr("href");
			posterid = posterid.replace("member.php?u=", "");
			$(this).find(".postlinking").append("<a href='profile.php?do=addlist&userlist=ignore&u="+posterid+"' target='_blank'><img src='https://i.imgur.com/RaoUuug.png'/ title='Ignore User'></a>");	}
	});

	if (localStorage.getItem("fpfThreadTitleHighlight") === "true")
		$("#lastelement").css({ "color": "#FF0000", "font-weight": "bold" });	//makes thread titles glowy and red

	if (localStorage.getItem("fpfHighlightLast") === "true")
		$(".postcontainer").last().find(".posthead").css("background", "rgba(34, 136, 255, 1.0)");

	if (localStorage.getItem("fpfEnhancedIgnore") === "true"){
		$(".postbitignored").each(function(){
			$(this).fadeTo(0, 0.15);	});
	}

	if (localStorage.getItem("fpfResizeUserTitles") === "true"){	//Code by luastoned (https://facepunch.com/member.php?u=118944)
		var userTitles = document.getElementsByClassName("usertitle");
		for (var i = 0; i < userTitles.length; i++){
			userTitles[i].style.fontSize = "10px";
			var fontTags = userTitles[i].getElementsByTagName("font");
			for (var j = 0; j < fontTags.length; j++)
				fontTags[j].setAttribute("size", 1);	}
	}
}

else if (currentPage.indexOf("member.php") >= 0 && localStorage.getItem("fpfProfileMessageDeleted") === "true"){	//code found on a post from Teddybeer
	$("li:contains('This message has been deleted by')").remove();	}

else if (currentPage.indexOf("/members/") >= 0){	//for some reason fp uses two syntaxes for profiles. clicking an avatar on forumhome.php uses this syntax, nothing else that i know of uses it.
	window.location.href=currentPage.replace("members/", "member.php?u=");	}

else if ((currentPage.indexOf("forum.php") >= 0 || currentPage == ("https://facepunch.com/")) && localStorage.getItem("fpfDoubleColumn") === "true"){	//Code posted by Baboo00 -- https://goo.gl/mSlBfW
	$(".forums").first().next().nextAll().appendTo($("<td valign='top' class='FrontPageForums'></td>").insertAfter(".FrontPageForums"));
	$(".FrontPageForums").css("padding", "5px");
    $(".last_post_column").css("max-width", "200px");
    $(".last_post_column").css("min-width", "200px");	}

else if (currentPage.indexOf("ignorelist") >= 0 && localStorage.getItem("fpfEnhancedIgnore") === "true"){
	ignoredList = [];
	$("#ignorelist").children("li").children("a").each(function(){ ignoredList.push($(this).text()); });
	localStorage.setItem("ignoredUsers", JSON.stringify(ignoredList));	}

else if ((currentPage.indexOf("forumdisplay.php") >0 || currentPage.indexOf("fp_popular.php")) && localStorage.getItem("fpfEnhancedIgnore") === "true"){
	enhanceIgnore();
}

$(".fakeLink").click();	//this fixes the double click bug
$(".fakeLink").css("cursor", "pointer");
console.info("FP Fixer completed successfully");