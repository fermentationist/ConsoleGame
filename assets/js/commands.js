const commands = [
	// Move
	[_move, "north,North,NORTH,n,N"],
	[_move, "south,South,SOUTH,s,S"],
	[_move, "east,East,EAST,e,E"],
	[_move, "west,West,WEST,w,W"],
	[_move, "up,Up,UP,u,U"],
	[_move, "down,Down,DOWN,d,D"],

	// Actions
	[_look, "look,Look,LOOK,l,L"],
	[_inventory, "inventory,Inventory,INVENTORY,i,I"],
	[_use, "use,Use,USE"],
	[_take, "take,Take,TAKE,t,T"],
	[_read, "read,Read,READ"],

	// Objects
	[_objects, "repellant,Repellant,REPELLANT,grue_repellant,Grue_repellant,Grue_Repellant,GRUE_REPELLANT"],
	[_objects, "key,Key,KEY"],
	[_objects, "note,Note,NOTE"],

	// Misc
	[_inventoryTable, "inventoryTable,invTable"],
	[_poof, "poof,Poof,POOF"],
	[_oops, "oops,Oops,OOPS"]
];

export default commands;