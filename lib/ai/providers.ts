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
import { google } from '@ai-sdk/google';
import { replicate } from '@ai-sdk/replicate';
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4o-mini'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-2.0-flash-exp'),
        'artifact-model': google('gemini-2.5-pro-exp-03-25'),
      },
      imageModels: {
        'small-model': replicate.image('black-forest-labs/flux-schnell'),
        'medium-model': replicate.image('black-forest-labs/flux-dev'),
        'large-model': replicate.image('black-forest-labs/flux-1.1-pro'),
      },
    });
