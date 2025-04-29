import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { openai } from '@ai-sdk/openai';
import { replicate } from '@ai-sdk/replicate';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
      imageModels: {
        'small-model': replicate.image('flux-schnell'),
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4.1-mini'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('o3'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('gpt-4.1-mini'),
        'artifact-model': openai('gpt-4.1-mini'),
      },
      imageModels: {
        'small-model': replicate.image('flux-schnell'),
      },
    });
