![Image 1](Assets/arbreakout_1.png?raw=true "AR Breakout Demo")
![Image 2](Assets/arbreakout.jpg?raw=true "AR Breakout Demo")

# ARBreakout
AR Breakout Rooms for Hack'20 Hackathon. AR Breakout Rooms aims to make remote working with small groups feel more physically present. AR Breakout Rooms uses ARCore and ARKit to bring the avatars of your friends, family and co-workers right in the same space, and enables face-to-face talking and sharing 3D content.

API Spec:
- Initialization: server to client
{
	action: "register",
	id: ...
}
- Initialization: client to server
{
	action: "sync",
	name: "[player_name]",
	relativeX: ... (float),
	relativeY: ... (float),
	relativeZ: ... (float),
	rotationX: ... (float),
	rotationY: ... (float),
	rotationZ: ... (float)
}

- Updating position: client to server
  ,
{
	action: "updatePosition"
	id: ...,
	relativeX: ... (float),
	relativeY: ... (float),
	relatizeZ: ... (float),
	rotationX: ... (float),
	rotationY: ... (float),
	rotationZ: ... (float)
}
- Response json array (on the updatePosition)
[
	{id: ....,
	name: ...,
	relativeX: ...,
	relativeY: ...,
	relativeZ: ...,
	deltaRotationX: ...,
	deltaRotationY: ...,
	deltaRotationZ: ...}
	
	, ...
	
]
