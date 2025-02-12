import { Request, Response } from 'express';
import { ContactService } from '../services/ContactService';

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService();
  };

  async addFormInput(req: Request, res: Response): Promise<void> {
    try {
      let result = await this.contactService.addFormInput(req.body);
      if (result === 0) {
        res.status(201).json({ message: 'Form input added successfully' });
      } else {
        res.status(500).json({ error: 'Failed to save contact form' });
      };
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    };
  };
};
