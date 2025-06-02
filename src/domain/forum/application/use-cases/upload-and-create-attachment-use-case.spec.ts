import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment-use-case";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;

let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "avatar.jpg",
      fileType: "image/jpeg",
      body: Buffer.from("fake-body"),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "avatar.jpg",
      })
    );
  });

  it("should not be able to upload and create an attachment with invalid file type", async () => {
    const result = await sut.execute({
      fileName: "file.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from("fake-body"),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
