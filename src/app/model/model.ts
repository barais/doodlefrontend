export interface Poll {
 createdAt?: Date;
 description?: string;
 has_meal?: boolean;
 id?: number;
 location?: string;
 padURL?: string;
 pollChoices?: PollChoice[];
 pollComments?: PollCommentElement[];
 pollMealPreferences?: PollCommentElement[];
 slug?: string;
 slugAdmin?: string;
 title?: string;
 tlkURL?: string;
 updatedAt?: Date;
}

export interface PollChoice {
 endDate?: Date;
 id?: number;
 startDate?: Date;
 users?: User[];
}

export interface User {
 id?: number;
 username?: string;
}

export interface ChoiceUser {
  username?: string;
  mail?: string;
  pref?: string;
  choices?: number[];
 }

export interface PollCommentElement {
 content?: string;
 id?: number;
 auteur?: string;
}
