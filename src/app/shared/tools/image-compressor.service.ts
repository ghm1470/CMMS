import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageCompressorService {
  constructor() {}

  async compress(blob, targetFileSizeKb, threshold) {
    if (blob.size / 1000 < targetFileSizeKb) return blob;

    const img = document.createElement('img');
    const imgPromise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
    });

    img.src = window.URL.createObjectURL(blob);

    await imgPromise;

    let width = img.width;
    let height = img.height;
    let file = blob;

    while (Math.abs(file.size / 1000 - targetFileSizeKb) > threshold) {
      if (file.size / 1000 < targetFileSizeKb - threshold) {
        width += Math.round(width / 2);
        height += Math.round(height / 2);
      } else if (file.size / 1000 > targetFileSizeKb + threshold) {
        width = Math.round(width / 2);
        height = Math.round(height / 2);
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      context.scale(canvas.width / img.width, canvas.height / img.height);
      context.drawImage(img, 0, 0);

      const blobPromise = new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => resolve(b), file.type);
      });

      file = await blobPromise;
    }

    return file;
  }
}
