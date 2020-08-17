import React from 'react';
import './App.css';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.ref=React.createRef()
        this.state = {
            img:[]
        }
    }
    componentDidMount() {
        this.test()
    }

    pushImg = (url)=>{
        let img = this.state.img;
        img.push(url);
        this.setState({img:img})
    }

    stringToUint = (string)=>{
        var string = btoa(unescape(encodeURIComponent(string))),
            charList = string.split(''),
            uintArray = [];
        for (var i = 0; i < charList.length; i++) {
            uintArray.Push(charList[i].charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    }

    uintToString = (uintArray)=>{
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(atob(encodedString)));
        return decodedString;
    }

    img = ()=>{
        fetch("/cgi-bin/snapshot.cgi?channel=1")
            .then(res=>res.blob())
            .then(res=>{
                let reader = new FileReader();
                reader.readAsDataURL(res);
                reader.onload = ()=> {
                    this.pushImg(reader.result)
                };


            })
    }

    test = ()=>{
        let pushImg = this.pushImg;
        let receivedLength = 0;
        let chunks = []
        let size=0;
        fetch("/cgi-bin/snapManager.cgi?action=attachFileProc&Flags[0]=Event&Events=[FaceDetection]")
            .then(response=>{
                const reader = response.body.getReader()
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }

                                let dec = new TextDecoder('utf-8');
                                let data = dec.decode(value);
                                if(data.includes("--myboundary")){
                                    if(receivedLength) {
                                        let chunksAll = new Uint8Array(receivedLength);
                                        let position = 0;
                                        for (let chunk of chunks) {
                                            chunksAll.set(chunk, position);
                                            position += chunk.length;
                                        }
                                        chunksAll=chunksAll.slice(size+133)
                                        let blob = new Blob([chunksAll], {type: 'image/jpeg'});
                                        let reader = new FileReader();
                                        reader.readAsDataURL(blob);
                                        reader.onload = ()=> {
                                            pushImg(reader.result)
                                        };
                                        let result = new TextDecoder("utf-8").decode(chunksAll);
                                        console.log(size)
                                        console.log(result);
                                    }
                                    chunks=[]
                                    receivedLength=0;
                                    chunks.push(value);
                                    receivedLength += value.length;
                                    size = data.split("Content-Length: ")[1]
                                    if(size){
                                        size=parseInt(size.split("\n")[0])
                                    }else{
                                        size=0;
                                    }

                                }else{
                                    chunks.push(value);
                                    receivedLength += value.length;
                                }


                            controller.enqueue(value);
                            push();
                        });
                    };

                    push();
                }
            });

            return new Response(stream, { headers: { "Content-Type": "text/html" } });
        })
    }

    render() {
        return (
            <div className="App">
                {this.state.img.map((item,key)=> <img src={item}/>)}
            </div>
        );
    }
}

export default App;
