using UnityEngine;

public class ColorChange : MonoBehaviour
{
    Renderer rend;

    // Start is called before the first frame update
    void Start()
    {
        rend = GetComponent<Renderer>();
        rend.material.SetColor("_Color", Random.ColorHSV());

    }
}
