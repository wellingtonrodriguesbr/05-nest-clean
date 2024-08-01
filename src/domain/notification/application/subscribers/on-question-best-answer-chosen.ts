import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification-use-case";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-anwser-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification(
    event: QuestionBestAnswerChosenEvent
  ) {
    const answer = await this.answersRepository.findById(
      event.bestAnswerId.toString()
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida`,
        content: `A resposta que você enviou em ${event.question.title.substring(
          0,
          20
        )} foi escolhida como a melhor resposta pelo autor.`,
      });
    }
  }
}
