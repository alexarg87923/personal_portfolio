import { type Request, type Response } from 'express';
import { ContactService } from '../services/ContactService';
import { type Logger } from 'pino';

export class ContactController {
  constructor(private contactService: ContactService, private logger: Logger) {};

  async addFormInput(req: Request, res: Response): Promise<void> {
    this.logger.trace('[ContactController] Entering addFormInput');
    
    try {
      this.logger.debug({ formData: req.body }, '[ContactController] -> [ContactService] Calling addFormInput');
      let result = await this.contactService.addFormInput(req.body);
      this.logger.debug({ status: result.status }, '[ContactController] <- [ContactService] addFormInput returned');
      
      if (result.status === 0) {
        this.logger.info('[ContactController] Contact form submission successful');
        res.status(201).json({ message: 'Form input added successfully' });
        this.logger.trace('[ContactController] Exiting addFormInput (success)');
      } else {
        this.logger.error('[ContactController] Failed to save contact form');
        res.status(500).json({ error: 'Failed to save contact form' });
        this.logger.trace('[ContactController] Exiting addFormInput (save failed)');
      };
    } catch (error: any) {
      this.logger.error({ error }, '[ContactController] Internal server error in contact form submission');
      res.status(500).json({ error: 'Internal server error', message: error.message });
      this.logger.trace('[ContactController] Exiting addFormInput (exception)');
    };
  };
};
