# ARBreakout
AR Breakout Rooms for Hack'20 Hackathon


API Spec:
- Initialization: server to client
  action: register
{
	id: ...
}
- Spawning positions: server to client
  action: spawn,
{
	x: ...,
	y: ...,
	z: ...
}
- Updating position: client to server
  action: updatePosition,
{
	id: ...,
	relativeX: ... (float),
	relativeY: ... (float),
	relatizeZ: ... (float)
}
- Response json array (on the updatePosition)
  action: updatePosition
[
	{id: ....,
	name: ...,
	relativeX: ...,
	relativeY: ...,
	relativeZ: ...}
	
	, ...
	
]
