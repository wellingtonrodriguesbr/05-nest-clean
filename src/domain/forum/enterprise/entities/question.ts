import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Slug } from "./value-objects/slug";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-anwser-chosen-event";

import dayjs from "dayjs";

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | null;
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    return (this.props.updatedAt = new Date());
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    if (bestAnswerId === undefined || bestAnswerId === null) {
      return;
    }

    if (
      this.props.bestAnswerId === undefined ||
      this.props.bestAnswerId === null ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId)
      );
    }

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityId
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return question;
  }
}
