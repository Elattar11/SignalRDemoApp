

document.addEventListener('DOMContentLoaded', function () {

    var userName = prompt("Please Enter Your Name"); 

    var messageInp = document.getElementById("messageInp"); 

    var groupsNameInp = document.getElementById("groupNameInp");

    var messageToGroupInp = document.getElementById("messageToGroupInp");

    messageInp.focus();

    //Hub Connection

    var proxyConnection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

    //Start Connection
    proxyConnection.start().then(function () {

        //Individual
        document.getElementById("sendMessageBtn").addEventListener('click', function (e) {
            e.preventDefault();

            proxyConnection.invoke("Send", userName, messageInp.value);


        });

        //Group Join
        document.getElementById("joinGroupBtn").addEventListener('click', function (e) {
            e.preventDefault();

            proxyConnection.invoke("JoinGroup", groupsNameInp.value, userName);


        });

        //Message To Group
        document.getElementById("messageToGroupInp").addEventListener('click', function (e) {
            e.preventDefault();

            proxyConnection.invoke("SendToGroup", groupsNameInp.value, userName, messageToGroupInp.value);


        });

    }).catch(function (error) {
        console.log(error)
    });

    //RecieveMessage
    proxyConnection.on("ReceiveMessage", function (userName, message) {

        var listElement = document.createElement('li');

        listElement.innerHTML = `<strong>${userName}: </strong> ${message}`;

        document.getElementById("conversation").appendChild(listElement);
    });


    //NewMember
    proxyConnection.on("NewMember", function (userName, groupName) {

        var listElement = document.createElement('li');

        listElement.innerHTML = `<strong>${userName}: has joined ${groupName} </strong>`;

        document.getElementById("groupConversationUL").appendChild(listElement);
    });

    //ReceiveMessageGroup
    proxyConnection.on("ReceiveMessageGroup", function (userName, message) {

        var listElement = document.createElement('li');

        listElement.innerHTML = `<strong>${userName}: </strong> ${message}`;

        document.getElementById("groupConversationUL").appendChild(listElement);
    });

})