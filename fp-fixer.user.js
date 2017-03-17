// ==UserScript==
// @name            FPFixer
// @namespace       no
// @version         0.5
// @description     Provides various changes to facepunch.com
// @match           facepunch.com/*
// @match           www.facepunch.com/*
// ==/UserScript==

if (!localStorage.fpfInit) {
	localStorage.setItem("fpfInit", "true");
	localStorage.setItem("fpfNavbar", "true");
	localStorage.setItem("fpfLogo", "true");
	localStorage.setItem("fpfLogoutButton", "true");
	localStorage.setItem("fpfNotablePosts", "true");
	localStorage.setItem("fpfIgnoreLink", "true");
	localStorage.setItem("fpfThreadTitleHighlight", "true");
	localStorage.setItem("fpfFadeIgnored", "true");
	localStorage.setItem("fpfResizeUserTitles", "true");
	localStorage.setItem("fpfProfileMessageDeleted", "true");
	localStorage.setItem("fpfDoubleColumn", "true");
	localStorage.setItem("fpfHighlightLast", "true");
	alert("FP Fixer initialized. Be sure to adjust the settings in the new navbar link.");
}

var currentPage = window.location.href.replace("www.", "");
var html;

$.ajax({
	url: 'https://rawgit.com/lordhomogay/FP-Fixer/feature-test/options.html',
	cache: false,
	success: function(data) {
		html = data;
	}
});

$("#navbarlinks").append("<span id='fpfOptions' class='navbarlink fakeLink' style='float:left; padding-right:1em'><img src='/fp/ratings/information.png' />FPF Options</span>");
$("#fpfOptions").click(function(){
		function toggle(setting){
		if (localStorage.getItem(setting)  === "true")
			localStorage.setItem(setting, "false");
		else if (localStorage.getItem(setting)  === "false")
			localStorage.setItem(setting, "true");
	}
	CreateFloatingDiv(MouseX, MouseY, "fpfOptionsMenu", "urlBox");
	fpfOptionsMenu.innerHTML = html;
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
	$("#fpfFadeIgnored").append(localStorage.fpfFadeIgnored);
		$("#fpfFadeIgnored").click(function(){ toggle("fpfFadeIgnored"); });
	$("#fpfResizeUserTitles").append(localStorage.fpfResizeUserTitles);
		$("#fpfResizeUserTitles").click(function(){ toggle("fpfResizeUserTitles"); });
	$("#fpfProfileMessageDeleted").append(localStorage.fpfProfileMessageDeleted);
		$("#fpfProfileMessageDeleted").click(function(){ toggle("fpfProfileMessageDeleted"); });
	$("#fpfDoubleColumn").append(localStorage.fpfDoubleColumn);
		$("#fpfDoubleColumn").click(function(){ toggle("fpfDoubleColumn"); });
	$("#fpfHighlightLast").append(localStorage.fpfHighlightLast);
		$("#fpfHighlightLast").click(function(){ toggle("fpfHighlightLast"); });
	$("span:contains('true')").css("background-color", "rgb(110, 255, 112");
	$("span:contains('false')").css("background-color", "rgb(246, 201, 204");
	$(".fakeLink").css("cursor", "pointer");
});

if (localStorage.fpfNavbar == "true")
	$("#navbarlinks").prepend("<div class='navbarlink'><a href='/fp_ticker.php'><img src='/fp/navbar/ticker.png'/>Ticker</a></div>");

if (localStorage.fpfLogo == "true")
	$("#logo").children().children().attr("src", "https://cdn.rawgit.com/lordhomogay/FP-Fixer/feature-test/fplogo.png");

if(SECURITYTOKEN != "guest" && localStorage.fpfLogoutButton == "true")
	$(".footer_links").prepend("<a href='login.php?do=logout&logouthash="+SECURITYTOKEN+"'>Logout</a> - ");

if (currentPage.indexOf("showthread.php") >= 0){
	var	username = $("#navbar-login").find("strong").text();

	$("#posts li").each(function(){	//puts an ignore link in the postbit, highlights notable usergroups
		usergroup = $(this).find("a.username");
		if (localStorage.fpfNotablePosts == "true"){
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

		if (localStorage.fpfIgnoreLink == "true" && usergroup.html().indexOf(username) == -1){
			posterid = $(this).find("a.username").attr("href");
			posterid = posterid.replace("member.php?u=", "");
			$(this).find(".postlinking").append("<a href='profile.php?do=addlist&userlist=ignore&u="+posterid+"' target='_blank'><img src='https://i.imgur.com/RaoUuug.png'/ title='Ignore User'></a>");
		}
	});

	if (localStorage.fpfThreadTitleHighlight == "true")
		$("#lastelement").css({ "color": "#FF0000", "font-weight": "bold" });	//makes thread titles glowy and red

	if (localStorage.fpfHighlightLast == "true")
		$(".postcontainer").last().find(".posthead").css("background", "rgba(34, 136, 255, 1.0)");

	if (localStorage.fpfFadeIgnored == "true"){
		$(".postbitignored").each(function(){
			$(this).fadeTo(0, 0.15);
		});
	}

	if (localStorage.fpfResizeUserTitles == "true"){	//Code by luastoned (https://facepunch.com/member.php?u=118944)
		var userTitles = document.getElementsByClassName("usertitle");
		for (var i = 0; i < userTitles.length; i++){
			userTitles[i].style.fontSize = "10px";
			var fontTags = userTitles[i].getElementsByTagName("font");
			for (var j = 0; j < fontTags.length; j++)
				fontTags[j].setAttribute("size", 1);
		}
	}
}

else if (currentPage.indexOf("member.php") >= 0 && localStorage.fpfProfileMessageDeleted == "true"){	//code found on a post from Teddybeer
	$("li:contains('This message has been deleted by')").remove();
}

else if (currentPage.indexOf("/members/") >= 0){	//for some reason fp uses two syntaxes for profiles. clicking an avatar on forumhome.php uses this syntax, nothing else that i know of uses it.
	window.location.href=currentPage.replace("members/", "member.php?u=");
}

else if ((currentPage.indexOf("forum.php") >= 0 || currentPage == ("https://facepunch.com/")) && localStorage.fpfDoubleColumn == "true"){	//Code posted by Baboo00 -- https://goo.gl/mSlBfW
	$(".forums").first().next().nextAll().appendTo($("<td valign='top' class='FrontPageForums'></td>").insertAfter(".FrontPageForums"));
	$(".FrontPageForums").css("padding", "5px");
    $(".last_post_column").css("max-width", "200px");
    $(".last_post_column").css("min-width", "200px");
}

$(".fakeLink").click();	//this fixes the double click bug
$(".fakeLink").css("cursor", "pointer");
console.info("FP Fixer completed successfully");