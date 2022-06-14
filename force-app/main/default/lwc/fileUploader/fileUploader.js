import {LightningElement} from 'lwc';

export default class FileUploader extends LightningElement {

    addAttachment(event) {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                const bodyBase64 = reader.result.split(',')[1];
                this.dispatchEvent(new CustomEvent('uploadfile', {detail: {bodyBase64, fileName: file.name}}));
            }

            reader.readAsDataURL(file)
        } catch (error) {
            console.error(error);
        }
    }
}