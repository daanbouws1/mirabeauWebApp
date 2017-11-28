import {autoinject} from "aurelia-framework"
import {DialogService} from "aurelia-dialog";
import {InvalidFileDialog} from "./invalid-file-dialog";

@autoinject
export class Branding {

  private bigLogoFile: any;
  private bigLogoFilename: string;
  private smallLogoFile: any;
  private smallLogoFilename: string;
  private color: string;

  constructor(private dialogService: DialogService){}

  activate(){}

  private onLogoFileChange(event) {
    //check if file has right extension
    if (event.detail.file) {
      const ext = event.detail.file.name.toString().substr(
        event.detail.file.name.toString().lastIndexOf(".") + 1,
        event.detail.file.name.toString().length) ||
        event.detail.file.name.toString();
      if (!(ext === "png" || ext === "jpg" || ext == "jpeg")) {
        //tell user to try again and open dialog that lets them do so.
        this.dialogService.open({
          viewModel: InvalidFileDialog,
          model: {
            title: "Invalid file",
            message: "This file is not an image file, but a",
            ext: ext,
            message2: ". Please select an image file",
            // opens up another upload-file dialog by calling the browse() function from upload-file.ts
            browse: () => this.uploader.browse()
          }
        });
        return;
      }
      this.bigLogoFile = event.detail.file;
      this.bigLogoFilename= event.detail.file.name.toString();
    } else {
      this.bigLogoFilename = null;
      this.bigLogoFile = null;
    }
  }

  private onSmallLogoFileChange(event) {
    //check if file has right extension
    if (event.detail.file) {
      const ext = event.detail.file.name.toString().substr(
        event.detail.file.name.toString().lastIndexOf(".") + 1,
        event.detail.file.name.toString().length) ||
        event.detail.file.name.toString();
      if (!(ext === "png" || ext === "jpg")) {
        //tell user to try again and open dialog that lets them do so.
        this.dialogService.open({
          viewModel: InvalidFileDialog,
          model: {
            title: "Invalid file",
            message: "This file is not an image file, but a",
            ext: ext,
            message2: ". Please select an image file",
            // opens up another upload-file dialog by calling the browse() function from upload-file.ts
            browse: () => this.uploader.browse()
          }
        });
        return;
      }
      this.smallLogoFile = event.detail.file;
      this.smallLogoFilename = event.detail.file.name.toString();
    } else {
      this.smallLogoFilename = null;
      this.smallLogoFile = null;
    }
  }

  private submit() {

  }
}
