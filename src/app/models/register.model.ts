

export class Register{

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public date: Date;

    constructor(format:string, text: string){
        this.format = format;
        this.text = text;
        this.date = new Date;
        this.determineType();
    }

    determineType(){
        const inputText = this.text.substring(0, 4);
        console.log(inputText)
        switch (inputText){
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
                break;
            case 'geo:':
                this.type = 'geo';
                this.icon = 'pin';
                break;
            default:
                this.type = 'undetermined';
                this.icon = 'create';
        }
    }


}