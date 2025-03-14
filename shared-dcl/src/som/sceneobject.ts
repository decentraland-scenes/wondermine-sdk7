export class SceneObject 
{
    public filename:string = ""
    public pos:number[] = []
    public angles:number[] = [ 0, 0, 0 ];
    public scale:number[] = [ 1, 1, 1 ];
    public portable:boolean = false;
    public throwable:boolean = false;
    public rigidbody:boolean = false;
    public physics:PhysicsData = new PhysicsData();
    public text:string = "";
}

export class PhysicsData
{
    public mass:number = 1;
    public bounciness:number = 0.4;
    public velocity:number[] = [ 0, 0, 0 ];
    public startStatic:boolean = true;
}

export class ZoneData
{
    public name:string = ""
    public zoneNum:number = 0
    public repeat:boolean = false;
    public text:string = ""
    public pos:number[] = [ 1, 1, 1 ];
    public scale:number[] = [ 2, 2, 2 ];

}