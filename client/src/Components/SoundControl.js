import { Component } from "react";
import Dropdown from "./Dropdown";
import SelectSource from "./SelectSource";
import click from './click1.wav';
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import './SoundControl.css';

class SoundControl extends Component{
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            isRecording: false,
            isPlaying: false,
            isDefaultAudio: false,
            isAvailable: false,
        };
        this.mediaRecorder = []
        //this.audioBlob = new Blob([]);
        this.recordedAudio = new Audio([])
        this.defaultAudio = new Audio([click])
        this.audio = this.defaultAudio
    }
    

    startPlayback = () => {
        if (this.state.isDefaultAudio){
            console.log('Listening to the default audio');
            this.defaultAudio.play(); 
        }else if (!this.state.isDefaultAudio){
            if (this.state.isAvailable){
                console.log('Listening to user recorded audio');
                this.recordedAudio.play(); 
            }
            else {alert('No Audio recorded yet!')}

        }
    };


    stopRecording = () =>{
        this.setState({
            isRecording: false
        });
        console.log('Recorded successfully!')
        
        this.mediaRecorder.stop();
        
        //this.postAudio(this.state.id, this.recordedAudio) /*recorded audio is not ok here, it is an HTML element*/
    };

    
        
            
                

       

    startRecording = async () =>{
        this.setState({
            isRecording: true
        });
        console.log('Recording...')

        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream, {'mimeType': 'audio/wav'});
            
            this.mediaRecorder.start();
            const audioChunks = [];
            
            this.mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
        
            this.mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, {'type': 'audio/wav;'});
                this.postAudioBlob(this.state.id, audioBlob)
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                this.setState({
                    isAvailable: true
                });
                this.recordedAudio = audio;
            });    
        });
    };

    postAudio = async (id,audio) => {
        const objct={id, audio };
        const response = await fetch("/audio", {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(objct)
        });
        if(response.ok){
          console.log("response worked!");
          console.log(response['audio'])
        }
      }

      postAudioBlob = async (id,audioBlob) => {
          
        const response = await fetch("/audioBlob", {
            method: "POST",
            headers:{
                "id": id
              },
            body: audioBlob
        });
        if(response.ok){
          console.log("response worked!");
          console.log(response['audioBlob'])
        }
      }
    
    swapSource = () =>{
        if (!this.state.isDefaultAudio){
            console.log('Default audio');
        }else if (this.state.isDefaultAudio){
            console.log('User recorded audio');
        }
        this.setState(state =>({
            isDefaultAudio: !state.isDefaultAudio
        }));
        //console.log(this.state.isDefaultAudio);
    }
    

    render(){
        const { isDefaultAudio, isRecording } = this.state;
        
        return (
            <div className="soundcontrol">

                <button className="playing" onClick={this.startPlayback}>
                    Play   
                </button>                    
                

                <button className="recording"
                    onClick={isRecording ? this.stopRecording : this.startRecording}>
                        {isRecording ? 'Stop' : 'Record'}
                    
                </button>
            
                <button className='load'
                    onClick={this.swapSource}>
                        {isDefaultAudio ? 'Default' : 'User'}
                </button>
              

            </div>
        );
    }
}


export default SoundControl;