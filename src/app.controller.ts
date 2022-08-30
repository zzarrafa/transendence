import { Get, Controller, Render, Res } from '@nestjs/common';

@Controller()
export class AppController {
	constructor() {}

	@Get()
	@Render('index2')
	root() {
		return ;
	}
}
