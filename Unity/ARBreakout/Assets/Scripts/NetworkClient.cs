using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NetworkClient : MonoBehaviour //: SocketIOComponent
{
    public GameObject PlayerModel;
    private Dictionary<string, GameObject> playerObjects;
    private string id = null;
     
    // Start is called before the first frame update
    /*public override void Start()
    {
        base.Start();
    }

    // Update is called once per frame
    public override void Update()
    {
        base.Update();
    }

    private void setupEvents()
    {
        On("open", (E) =>
        {
            Debug.Log("Connection made");
        });

        On("register", (E) =>{
            Debug.Log("Got register server response");
            JSONObject data = E.data;
            string id = cleanJSONStr(data["id"].ToString());
            this.id = id;
            JSONObject syncObj = new JSONObject(JSONObject.Type.OBJECT);
            syncObj.AddField("name", "Player One");
            Emit("sync", syncObj);
        });

        On("updatePosition", (E) => {
            List<JSONObject> positionsList = E.data.list;
            updatePlayerPositions(positionsList);

        });
    }

    private void updatePlayerPositions(List<JSONObject> positionsList)
    {
        foreach(JSONObject obj in positionsList)
        {
            string id = cleanJSONStr(obj["id"].ToString());
            if(id == getID())
            {
                continue;
            }
            if (playerObjects.ContainsKey(id))
            {
                //Update position
            }
            else
            {
                //Set new Player
                GameObject nplayer = Instantiate(PlayerModel);
            }
        }
    }

    private string cleanJSONStr(string item)
    {
        if (item[0] == '\"')
        {
            return item.Substring(1, item.Length - 2);
        }
        return item;
    }

    public string getID()
    {
        return this.id;
    }*/
}
