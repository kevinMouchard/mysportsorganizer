import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  messageService = inject(MessageService);

  showMessage(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
  }

}
