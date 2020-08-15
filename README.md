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
	name: "[player_name]"
}
- Spawning positions: server to client
  ,
{
	action: "spawn"
	x: ...,
	y: ...,
	z: ...
}

- Updating position: client to server
  ,
{
	action: "updatePosition"
	id: ...,
	relativeX: ... (float),
	relativeY: ... (float),
	relatizeZ: ... (float)
}
- Response json array (on the updatePosition)
[
	{id: ....,
	name: ...,
	relativeX: ...,
	relativeY: ...,
	relativeZ: ...}
	
	, ...
	
]
