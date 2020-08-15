# ARBreakout
AR Breakout Rooms for Hack'20 Hackathon


API Spec:
- Initialization
{ name: 
- Updating position
{
	id: ...,
	action: updatePosition,
	relativeX: ... (float),
	relativeY: ... (float),
	relatizeZ: ... (float)
}

- Response json array
[
	{id: ....,
	name: ...,
	relativeX: ...,
	relativeY: ...,
	relativeZ: ...}
	
	, ...
	
]