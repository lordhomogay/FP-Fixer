// ==UserScript==
// @name            FPFixer
// @namespace       no
// @version         0.5
// @description     Provides various changes to facepunch.com
// @match           facepunch.com/*
// @match           www.facepunch.com/*
// @grant           none
// ==/UserScript==

$("#navbarlinks").prepend("<div class='navbarlink'><a href='/fp_ticker.php'><img src='/fp/navbar/ticker.png'/>Ticker</a></div>");
$("#logo").children().children().attr("src", "https://i.imgur.com/CX9h2Dv.png");

if(SECURITYTOKEN != "guest")
	$(".footer_links").prepend("<a href='login.php?do=logout&logouthash="+SECURITYTOKEN+"'>Logout</a> - ");

var currentPage = window.location.href.replace("www.", "");


if (currentPage.indexOf("showthread.php") >= 0){
	
	var	devPosts = 0,	greenPosts = 0,
		goldPosts = 0,	bluePosts = 0,
		redPosts = 0,	postcount = 0,
		username = $("#navbar-login").find("strong").text();
	
	$("#posts li").each(function(){	//Finds the userID(referred to as posterid) of each post, puts the ignore link in the top right of each post, highlight usergroups backgrounds
		usergroup = $(this).find("a.username");

		if (usergroup.html().indexOf(">garry</") >= 0){						//garry -- the brackets around the name ensure that only the correct garry is highlighted
			$(this).find(".postdetails, .postfoot").css("background", "rgba(185, 211, 238, 0.7)");
			devPosts++;
		}
		else if (usergroup.html().indexOf("color:rgb(0, 112, 255)") >= 0 ){	//dev member
			$(this).find(".postdetails, .postfoot").css("background", "rgba(0, 205, 255, 0.7)");
			devPosts++;
		}
		else if (usergroup.html().indexOf("color:#00aa00") >= 0){			//green member
			$(this).find(".postdetails, .postfoot").css("background", "rgba(110, 255, 112, 0.7)");
			greenPosts++;
		}
		else if (usergroup.html().indexOf("#A06000") >= 0){					//gold member
//			$(this).find(".postdetails, .postfoot").css("background", "rgba(255, 239, 153, 0.7)");
			goldPosts++;
		}
		else if (usergroup.html().indexOf("color=\"red\"") >= 0){			//red member
//			$(this).find(".postdetails, .postfoot").css("background", "rgba(246, 201, 204, 0.7)");
			redPosts++;
		}
		else {																//none of the above, either a usergroup i forgot or a blue member
//			$(this).find(".postdetails, .postfoot").css("background", "rgba(255, 255, 255, 0.6)");
			bluePosts++;
		}


		if (usergroup.html().indexOf(username) >= 0){	//makes your posts more noticable
			$(this).find(".postdetails, .postfoot").css("background", "rgba(238, 255, 188, 1.0)");
		}
		else{	//puts the ignore link on all posts except yours
			posterid = $(this).find("a.username").attr("href");
			posterid = posterid.replace("member.php?u=", "");
			$(this).find(".postlinking").append("<a href='profile.php?do=addlist&userlist=ignore&u="+posterid+"' target='_blank'><img src='https://i.imgur.com/RaoUuug.png'/ title='Ignore User'></a>");
		}

		postcount = devPosts+greenPosts+goldPosts+redPosts+bluePosts;
	
	});
	
	$("#lastelement").css({ "color": "#FF0000", "font-weight": "bold" });	//makes thread titles glowy and red
	$("#navbarlinks").append("<span id='fpfForumStats' class='navbarlink fakeLink' style='float:left; padding-right:1em'><img src='/fp/ratings/information.png' />Page Stats</span>");	//post stats on the top right navbar when viewing a thread


	$("#fpfForumStats").click(function(){	//this is the dropdown function for thread stats
		var totalPosts = devPosts + greenPosts + goldPosts + bluePosts + redPosts;
		CreateFloatingDiv(MouseX, MouseY, "fpfThreadStats", "urlBox");
		fpfThreadStats.innerHTML = "<span style='color:rgb(0, 112, 255);font-weight:bold;'>Dev Posts: "+devPosts+"</span><br /><span style='color:#00aa00; font-weight:bold;'>Green posts: "+greenPosts+"</span><br /><strong><font color='#A06000'>Gold Posts: "+goldPosts+"</font></strong><br /><font color='blue'>Blue Posts: "+bluePosts+"</font><br /><font color='red'>Red Posts: "+redPosts+"</font><br />Total Posts: "+totalPosts+"</span>";
	});

	$("#fpfForumStats").click();	//this fixes the double click bug.

	$(".postcontainer").last().find(".posthead").css("background", "rgba(34, 136, 255, 1.0)");

	$(".postbitignored").each(function(){
		$(this).fadeTo(0, 0.15);
	});
}


else if (currentPage.indexOf("member.php") >= 0){
	$("li:contains('This message has been deleted by')").remove();		//code found on a post from Teddybeer
}

else if (currentPage.indexOf("/members/") >= 0){	//for some reason fp uses two syntaxes for profiles. clicking an avatar on forumhome.php uses this syntax, nothing else that i know of uses it.
	window.location.href=currentPage.replace("members/", "member.php?u=");
}

else if (currentPage.indexOf("forum.php") >= 0 || currentPage == ("https://facepunch.com/") ){	//double column forumhome -- made by reagy (https://facepunch.com/member.php?u=44687)
//Code posted by Baboo00 -- https://goo.gl/mSlBfW
	$(".forums").first().next().nextAll().appendTo($("<td valign='top' class='FrontPageForums'></td>").insertAfter(".FrontPageForums"));
	$(".FrontPageForums").css("padding", "5px");
    $(".last_post_column").css("max-width", "200px");
    $(".last_post_column").css("min-width", "200px");
}

//Resize user titles -- Code by luastoned (https://facepunch.com/member.php?u=118944)
var userTitles = document.getElementsByClassName("usertitle");
for (var i = 0; i < userTitles.length; i++){
	userTitles[i].style.fontSize = "10px";
	var fontTags = userTitles[i].getElementsByTagName("font");
	for (var j = 0; j < fontTags.length; j++)
		fontTags[j].setAttribute("size", 1);    }

$(".fakeLink").css("cursor", "pointer");
console.info("FP Fixer completed successfully");
