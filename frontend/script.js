
function execquery() {
    let token = "";
    let link = document.getElementById("text").value;
    

    if (checkLink(link)) {

        if (localStorage.getItem("token") && localStorage.getItem("link") == link) {
            token = localStorage.getItem("token");
            console.log(token)
        }

        fetch("http://localhost:5000/getdata", {
            method: "POST",
            body: JSON.stringify({
                link: link,
                nextPageToken: token
            }),
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        }
        ).then((res) => {
            const pro = res.json()
            pro.then((data) => {
                console.log(data.token, data.emotionlist)
                localStorage.setItem("token", data.token)
                localStorage.setItem("link",link)
            })
        })
    }
}

function checkLink(link)
{
    if(link.length >= 60)
    {
        alert("enter valid link");
        return false;
    }
    else if(link.search("www.youtube.com") == -1  || link.search("=")== -1) {
        alert("enter valid link");
        return false;
    }
    else{
        return true;
    }
}
