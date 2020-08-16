# ARBreakout
AR Breakout Rooms for Hack'20 Hackathon


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
