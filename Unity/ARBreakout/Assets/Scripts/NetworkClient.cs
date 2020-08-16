using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using SocketIO;

public class NetworkClient : SocketIOComponent
{
    public GameObject PlayerModel;
    public GameObject Origin;
    public GameObject Player;
    private Dictionary<string, GameObject> playerObjects;
    private Dictionary<string, Vector3> originalHeadRotations;
    private string id = null;
    private static float updateTime = 5f; //Seconds to send server corrected position.
     
    // Start is called before the first frame update
    public override void Start()
    {
        playerObjects = new Dictionary<string, GameObject>();
        originalHeadRotations = new Dictionary<string, Vector3>();
        base.Start();
        setupEvents();
        StartCoroutine("UpdatePos");
    }

    // Update is called once per frame
    public override void Update()
    {
        base.Update();
        
    }

    //Send new player postiion to server
    IEnumerator UpdatePos()
    {
        for (; ; )
        {
            JSONObject updateObj = new JSONObject(JSONObject.Type.OBJECT);
            updateObj.AddField("id", id);
            Vector3 relPos = Player.transform.position - Origin.transform.position;
            updateObj.AddField("relativeX", relPos.x);
            updateObj.AddField("relativeY", relPos.y);
            updateObj.AddField("relativeZ", relPos.z);
            Emit("updatePosition", updateObj);
            yield return new WaitForSeconds(updateTime);
        }
    }

    private void setupEvents()
    {
        Debug.Log("Setting up events");
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
            Vector3 relPos = Player.transform.position - Origin.transform.position;
            syncObj.AddField("relativeX", relPos.x);
            syncObj.AddField("relativeY", relPos.y);
            syncObj.AddField("relativeZ", relPos.z);
            syncObj.AddField("rotationX", Player.transform.eulerAngles.x);
            syncObj.AddField("rotationY", Player.transform.eulerAngles.x);
            syncObj.AddField("rotationZ", Player.transform.eulerAngles.x);
            Emit("sync", syncObj);
        });

        On("syncPosition", (E) => {
            List<JSONObject> positionsList = E.data["users"].list;
            Debug.Log("Syncing positions of " + positionsList.Count + " players");
            updatePlayerPositions(positionsList);

        });
    }

    private void updatePlayerPositions(List<JSONObject> positionsList)
    {
        foreach(JSONObject obj in positionsList)
        {
            string pid = cleanJSONStr(obj["id"].ToString());
            Debug.Log("Updating player position with id: " + pid);
            if (playerObjects.ContainsKey(pid) ==true)
            {
                //Update position
                GameObject playerHead;
                playerObjects.TryGetValue(pid, out playerHead);
                if (playerHead != null)
                {
                    
                    playerHead.transform.position = new Vector3(obj["relativeX"].n, obj["relativeY"].n, obj["relativeZ"].n);
                    Debug.Log("Updating currently existing player position to " + playerHead.transform.position);
                    if (originalHeadRotations.ContainsKey(pid))
                    {
                        Vector3 originalRotations;
                        originalHeadRotations.TryGetValue(pid, out originalRotations);
                        playerHead.transform.eulerAngles = new Vector3(originalRotations.x + obj["rotationX"].n, originalRotations.y + obj["rotationY"].n, originalRotations.z + obj["rotationZ"].n);
                    }
                    else
                    {
                        Debug.Log("Recalculating player orientation");
                        playerHead.transform.LookAt(Player.transform.position);
                        originalHeadRotations.Add(pid, playerHead.transform.eulerAngles);

                    }
                }
                else
                {
                    Debug.Log("Error: Updating Player pos, tryGet failed");
                }
                
            }
            else
            {
                //Set new Player
                Debug.Log("Instantiating new player: "+ pid+";");
                GameObject nplayer = Instantiate(PlayerModel);
                float x = obj["relativeX"].n;
                Debug.Log("Player X: " + x);
                float y = obj["relativeY"].n;
                Debug.Log("Player Y: " + y);
                float z = obj["relativeZ"].n;
                nplayer.transform.position = new Vector3(x, y, z);
                nplayer.transform.LookAt(Player.transform.position);
                originalHeadRotations.Add(pid, nplayer.transform.eulerAngles);
                //Debug.Log("Position: "+nplayer.transform.position);
                playerObjects.Add(pid, nplayer);
                Debug.Log("Added player to dictionary");
                Debug.Log("Test added: " + playerObjects.ContainsKey(pid));
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
    }
}
